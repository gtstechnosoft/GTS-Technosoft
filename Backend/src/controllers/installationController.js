const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.listInstallations = async (req, res, next) => {
  try {
    const where = req.user.role === 'INTERNAL_ADMIN' && !req.query.orgId
      ? {}
      : { org_id: req.targetOrgId || req.user.orgId };

    const installations = await prisma.installation.findMany({
      where,
      include: {
        product: true,
        license: {
          select: {
            id: true,
            license_key: true,
            status: true,
            expiry_date: true
          }
        },
        organization: {
          select: {
            id: true,
            legal_name: true
          }
        }
      },
      orderBy: { last_contact: 'desc' }
    });

    return res.status(200).json({ success: true, data: installations });
  } catch (err) {
    next(err);
  }
};

exports.registerInstallation = async (req, res, next) => {
  try {
    const { licenseKey, productId, version, alias, os, ipAddress, systemFingerprint } = req.body;

    if (!licenseKey || !version || !alias) {
      return res.status(400).json({ success: false, message: 'License key, version, and alias are required' });
    }

    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey },
      include: {
        entitlement: {
          include: {
            subscription: true,
            edition: true
          }
        },
        installations: {
          where: { activation_status: 'ACTIVE' }
        }
      }
    });

    if (!license) {
      return res.status(404).json({ success: false, message: 'Invalid license key' });
    }

    if (license.status !== 'ACTIVE') {
      return res.status(400).json({ success: false, message: `License is ${license.status.toLowerCase()}` });
    }

    if (new Date(license.expiry_date) < new Date()) {
      return res.status(400).json({ success: false, message: 'License has expired' });
    }

    // Check activation limit
    const activationLimit = license.entitlement.activation_limit;
    if (license.installations.length >= activationLimit) {
      return res.status(400).json({
        success: false,
        message: `Activation limit exceeded (${license.installations.length}/${activationLimit} instances registered)`
      });
    }

    const orgId = license.entitlement.subscription.org_id;

    const installation = await prisma.installation.create({
      data: {
        org_id: orgId,
        license_id: license.id,
        product_id: productId || license.entitlement.subscription.product_id,
        version: version,
        alias: alias,
        os: os || 'Linux x86_64',
        ip_address: ipAddress || req.ip,
        system_fingerprint: systemFingerprint || null,
        activation_status: 'ACTIVE',
        last_contact: new Date()
      },
      include: {
        product: true,
        license: true
      }
    });

    await auditService.logEvent({
      actorId: req.user?.id || null,
      orgId: orgId,
      action: 'INSTALLATION_REGISTERED',
      target: `Instance:${installation.alias} (${installation.id})`,
      metadata: { licenseKey, version, os },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'Software instance registered and activated successfully',
      data: installation
    });
  } catch (err) {
    next(err);
  }
};

exports.sendHeartbeat = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { version, metrics } = req.body;

    const inst = await prisma.installation.update({
      where: { id },
      data: {
        last_contact: new Date(),
        activation_status: 'ACTIVE',
        ...(version && { version })
      }
    });

    return res.status(200).json({ success: true, message: 'Heartbeat acknowledged', timestamp: inst.last_contact });
  } catch (err) {
    next(err);
  }
};

exports.deleteInstallation = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inst = await prisma.installation.findUnique({
      where: { id }
    });

    if (!inst) {
      return res.status(404).json({ success: false, message: 'Installation not found' });
    }

    if (req.user.role !== 'INTERNAL_ADMIN' && inst.org_id !== req.user.orgId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await prisma.installation.delete({
      where: { id }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: inst.org_id,
      action: 'INSTALLATION_DECOMMISSIONED',
      target: `Instance:${inst.alias}`,
      metadata: { instanceId: inst.id },
      req
    });

    return res.status(200).json({ success: true, message: 'Instance decommissioned successfully' });
  } catch (err) {
    next(err);
  }
};
