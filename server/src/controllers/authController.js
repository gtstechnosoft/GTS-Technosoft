const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const config = require('../config/env');
const mfaService = require('../services/mfaService');
const auditService = require('../services/auditService');

// Helper to create tokens
const generateTokens = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    orgId: user.org_id
  };

  const accessToken = jwt.sign(payload, config.JWT.ACCESS_SECRET, {
    expiresIn: config.JWT.ACCESS_EXPIRES_IN
  });

  const refreshToken = jwt.sign(payload, config.JWT.REFRESH_SECRET, {
    expiresIn: config.JWT.REFRESH_EXPIRES_IN
  });

  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, organizationName, billingCountry } = req.body;

    if (!email || !password || !organizationName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and organization name are required'
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user account with this email already exists'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create Organization and Org Admin user inside transaction
    const result = await prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          legal_name: organizationName.trim(),
          display_name: organizationName.trim(),
          billing_country: billingCountry || 'India',
          status: 'ACTIVE'
        }
      });

      const user = await tx.user.create({
        data: {
          org_id: org.id,
          email: email.toLowerCase().trim(),
          password_hash: passwordHash,
          first_name: firstName || null,
          last_name: lastName || null,
          role: 'ORG_ADMIN',
          mfa_enabled: false,
          status: 'ACTIVE'
        },
        include: {
          organization: true
        }
      });

      return { org, user };
    });

    await auditService.logEvent({
      actorId: result.user.id,
      orgId: result.org.id,
      action: 'USER_REGISTERED',
      target: `User:${result.user.email}`,
      metadata: { orgName: result.org.legal_name, role: result.user.role },
      req
    });

    const tokens = generateTokens(result.user);

    return res.status(201).json({
      success: true,
      message: 'Account and Organization created successfully',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
          role: result.user.role,
          mfaEnabled: result.user.mfa_enabled,
          organization: result.user.organization
        },
        ...tokens
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, mfaCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { organization: true }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      await auditService.logEvent({
        actorId: user.id,
        orgId: user.org_id,
        action: 'AUTH_FAILED',
        target: `User:${user.email}`,
        metadata: { reason: 'INVALID_PASSWORD' },
        req
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (user.status === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account is suspended. Please contact GTS Support.'
      });
    }

    // Check MFA
    if (user.mfa_enabled) {
      if (!mfaCode) {
        return res.status(200).json({
          success: true,
          requiresMfa: true,
          tempUserId: user.id,
          message: 'MFA verification required. Please enter your 6-digit TOTP code.'
        });
      }

      const isMfaValid = mfaService.verifyToken(mfaCode, user.mfa_secret);
      if (!isMfaValid) {
        return res.status(401).json({
          success: false,
          requiresMfa: true,
          message: 'Invalid 6-digit MFA authenticator code'
        });
      }
    }

    const tokens = generateTokens(user);

    await auditService.logEvent({
      actorId: user.id,
      orgId: user.org_id,
      action: 'AUTH_LOGIN_SUCCESS',
      target: `User:${user.email}`,
      metadata: { mfaUsed: user.mfa_enabled },
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          mfaEnabled: user.mfa_enabled,
          organization: user.organization
        },
        ...tokens
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.setupMfa = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { secret, otpauth } = mfaService.generateSecret(user.email);
    const qrCodeUrl = await mfaService.generateQrCodeDataUrl(otpauth);

    // Temporarily save secret
    await prisma.user.update({
      where: { id: user.id },
      data: { mfa_secret: secret }
    });

    return res.status(200).json({
      success: true,
      message: 'MFA setup initiated. Scan the QR code with Google Authenticator or Authy.',
      data: {
        secret,
        qrCodeUrl,
        otpauthUrl: otpauth
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyAndEnableMfa = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'TOTP token is required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user || !user.mfa_secret) {
      return res.status(400).json({
        success: false,
        message: 'MFA setup has not been initiated. Request setup first.'
      });
    }

    const isValid = mfaService.verifyToken(token, user.mfa_secret);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid TOTP code. Check your authenticator app clock synchronization.'
      });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { mfa_enabled: true }
    });

    await auditService.logEvent({
      actorId: user.id,
      orgId: user.org_id,
      action: 'MFA_ENABLED',
      target: `User:${user.email}`,
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Two-Factor Authentication successfully verified and enabled on your account.'
    });
  } catch (err) {
    next(err);
  }
};

exports.disableMfa = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const passwordValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { mfa_enabled: false, mfa_secret: null }
    });

    await auditService.logEvent({
      actorId: user.id,
      orgId: user.org_id,
      action: 'MFA_DISABLED',
      target: `User:${user.email}`,
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Two-Factor Authentication has been disabled.'
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, config.JWT.REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true }
    });

    if (!user || user.status === 'SUSPENDED') {
      return res.status(401).json({ success: false, message: 'Account inaccessible' });
    }

    const tokens = generateTokens(user);

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          mfaEnabled: user.mfa_enabled,
          organization: user.organization
        },
        ...tokens
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        mfa_enabled: true,
        status: true,
        created_at: true,
        organization: true
      }
    });

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
};
