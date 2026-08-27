const prisma = require('../config/prisma');
const licenseSigner = require('../services/licenseSigner');
const auditService = require('../services/auditService');

exports.listLicenses = async (req, res, next) => {
  try {
    const where = req.user.role === 'INTERNAL_ADMIN' && !req.query.orgId
      ? {}
      : {
          entitlement: {
            subscription: {
              org_id: req.targetOrgId || req.user.orgId
            }
          }
        };

    const licenses = await prisma.license.findMany({
      where,
      include: {
        entitlement: {
          include: {
            edition: true,
            subscription: {
              include: {
                product: true,
                organization: true
              }
            }
          }
        },
        installations: {
          select: {
            id: true,
            alias: true,
            version: true,
            os: true,
            activation_status: true,
            last_contact: true
          }
        },
        trial: true
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: licenses });
  } catch (err) {
    next(err);
  }
};

exports.getLicenseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        entitlement: {
          include: {
            edition: true,
            subscription: {
              include: {
                product: true,
                organization: true
              }
            }
          }
        },
        installations: true
      }
    });

    if (!license) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    // Check tenant boundary
    if (req.user.role !== 'INTERNAL_ADMIN' && license.entitlement.subscription.org_id !== req.user.orgId) {
      return res.status(403).json({ success: false, message: 'Access denied to this license' });
    }

    return res.status(200).json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
};

exports.downloadLicFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        entitlement: {
          include: {
            edition: true,
            subscription: {
              include: {
                product: true,
                organization: true
              }
            }
          }
        }
      }
    });

    if (!license) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    const org = license.entitlement.subscription.organization;
    const product = license.entitlement.subscription.product;
    const edition = license.entitlement.edition;

    // Check authorization
    if (req.user.role !== 'INTERNAL_ADMIN' && org.id !== req.user.orgId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const fileContent = licenseSigner.generateLicFileContent(license, org, product, edition);
    const filename = `KavachIQ_${product.code.toUpperCase()}_${license.license_key}.lic`;

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: org.id,
      action: 'LICENSE_DOWNLOADED',
      target: `License:${license.license_key}`,
      metadata: { product: product.code, edition: edition.code },
      req
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(fileContent);
  } catch (err) {
    next(err);
  }
};

// Admin Issue License
exports.issueLicense = async (req, res, next) => {
  try {
    const { entitlementId, licenseType, expiryDate, customKeyId } = req.body;

    const entitlement = await prisma.entitlement.findUnique({
      where: { id: entitlementId },
      include: {
        edition: true,
        subscription: {
          include: {
            product: true,
            organization: true
          }
        }
      }
    });

    if (!entitlement) {
      return res.status(404).json({ success: false, message: 'Entitlement not found' });
    }

    const product = entitlement.subscription.product;
    const edition = entitlement.edition;
    const org = entitlement.subscription.organization;

    const licenseKey = licenseSigner.generateLicenseKey(product.code, edition.code);
    const calculatedExpiry = expiryDate 
      ? new Date(expiryDate) 
      : new Date(entitlement.subscription.end_date);

    // Build payload to sign
    const licensePayload = {
      license_key: licenseKey,
      organization: {
        id: org.id,
        legal_name: org.legal_name,
        domain: org.domain
      },
      product: {
        id: product.id,
        code: product.code,
        name: product.name
      },
      edition: {
        id: edition.id,
        code: edition.code,
        name: edition.name
      },
      entitlement: {
        metric_type: entitlement.metric_type,
        metric_limit: entitlement.metric_limit,
        activation_limit: entitlement.activation_limit,
        features: entitlement.features || edition.feature_profile
      },
      license_type: licenseType || 'SUBSCRIPTION',
      validity: {
        issued_at: new Date().toISOString(),
        expires_at: calculatedExpiry.toISOString()
      }
    };

    const { signedPayload, signature, keyId } = licenseSigner.signLicense(licensePayload, customKeyId);

    const createdLicense = await prisma.license.create({
      data: {
        entitlement_id: entitlement.id,
        license_type: licenseType || 'SUBSCRIPTION',
        license_key: licenseKey,
        issue_date: new Date(),
        expiry_date: calculatedExpiry,
        signing_key_id: keyId,
        status: 'ACTIVE',
        signed_payload: signedPayload,
        signature: signature
      },
      include: {
        entitlement: {
          include: {
            edition: true,
            subscription: {
              include: {
                product: true,
                organization: true
              }
            }
          }
        }
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: org.id,
      action: 'ADMIN_LICENSE_ISSUED',
      target: `License:${createdLicense.license_key}`,
      metadata: { licenseType, expiryDate: calculatedExpiry, keyId },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'License successfully generated and cryptographically signed',
      data: createdLicense
    });
  } catch (err) {
    next(err);
  }
};

// Admin Revoke License
exports.revokeLicense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        entitlement: {
          include: {
            subscription: true
          }
        }
      }
    });

    if (!license) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    const updated = await prisma.license.update({
      where: { id },
      data: { status: 'REVOKED' }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: license.entitlement.subscription.org_id,
      action: 'ADMIN_LICENSE_REVOKED',
      target: `License:${license.license_key}`,
      metadata: { reason: reason || 'Administrative revocation' },
      req
    });

    return res.status(200).json({
      success: true,
      message: `License ${license.license_key} has been revoked`,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

// Verify signed payload
exports.verifyLicensePayload = async (req, res, next) => {
  try {
    const { payload } = req.body;
    if (!payload) {
      return res.status(400).json({ success: false, message: 'Payload is required' });
    }

    const verification = licenseSigner.verifyLicense(payload);
    return res.status(200).json({ success: true, data: verification });
  } catch (err) {
    next(err);
  }
};
