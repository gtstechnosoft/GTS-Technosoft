const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.getCurrentOrg = async (req, res, next) => {
  try {
    const org = await prisma.organization.findUnique({
      where: { id: req.user.orgId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
            status: true,
            mfa_enabled: true,
            created_at: true
          }
        },
        subscriptions: {
          include: {
            product: true,
            entitlements: {
              include: {
                edition: true,
                licenses: true
              }
            }
          }
        }
      }
    });

    if (!org) {
      return res.status(404).json({ success: false, message: 'Organization not found' });
    }

    return res.status(200).json({ success: true, data: org });
  } catch (err) {
    next(err);
  }
};

exports.updateCurrentOrg = async (req, res, next) => {
  try {
    const { displayName, billingCountry, domain } = req.body;

    const updated = await prisma.organization.update({
      where: { id: req.user.orgId },
      data: {
        display_name: displayName,
        billing_country: billingCountry,
        domain: domain
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'ORG_UPDATED',
      target: `Organization:${updated.id}`,
      metadata: { displayName, billingCountry, domain },
      req
    });

    return res.status(200).json({ success: true, message: 'Organization updated', data: updated });
  } catch (err) {
    next(err);
  }
};

exports.listOrgUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      where: { org_id: req.user.orgId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        status: true,
        mfa_enabled: true,
        created_at: true
      },
      orderBy: { created_at: 'asc' }
    });

    return res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

exports.inviteOrgUser = async (req, res, next) => {
  try {
    const { email, firstName, lastName, role, tempPassword } = req.body;
    const bcrypt = require('bcryptjs');

    if (!email || !role) {
      return res.status(400).json({ success: false, message: 'Email and role are required' });
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existing) {
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(tempPassword || 'KavachIQ@Welcome2026!', 12);

    const newUser = await prisma.user.create({
      data: {
        org_id: req.user.orgId,
        email: email.toLowerCase().trim(),
        first_name: firstName,
        last_name: lastName,
        role: role,
        password_hash: passwordHash,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        status: true,
        created_at: true
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'USER_INVITED',
      target: `User:${newUser.email}`,
      metadata: { role: newUser.role },
      req
    });

    return res.status(201).json({ success: true, message: 'User successfully added to organization', data: newUser });
  } catch (err) {
    next(err);
  }
};

exports.removeOrgUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (userId === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot remove yourself from the organization' });
    }

    const userToRemove = await prisma.user.findFirst({
      where: { id: userId, org_id: req.user.orgId }
    });

    if (!userToRemove) {
      return res.status(404).json({ success: false, message: 'User not found in your organization' });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'USER_REMOVED',
      target: `User:${userToRemove.email}`,
      req
    });

    return res.status(200).json({ success: true, message: 'User removed from organization' });
  } catch (err) {
    next(err);
  }
};
