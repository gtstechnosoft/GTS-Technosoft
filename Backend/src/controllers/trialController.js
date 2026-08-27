const prisma = require('../config/prisma');
const licenseSigner = require('../services/licenseSigner');
const auditService = require('../services/auditService');

exports.listTrials = async (req, res, next) => {
  try {
    const where = req.user.role === 'INTERNAL_ADMIN' && !req.query.orgId
      ? {}
      : { org_id: req.targetOrgId || req.user.orgId };

    const trials = await prisma.trial.findMany({
      where,
      include: {
        organization: true,
        user: {
          select: { id: true, email: true, first_name: true, last_name: true }
        },
        product: true,
        edition: true,
        license: true
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: trials });
  } catch (err) {
    next(err);
  }
};

exports.requestTrial = async (req, res, next) => {
  try {
    const { productId, editionId, nodeLimit, notes } = req.body;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let targetEditionId = editionId;
    if (!targetEditionId) {
      const defaultEdition = await prisma.edition.findFirst({
        where: { product_id: productId }
      });
      targetEditionId = defaultEdition?.id;
    }

    const trial = await prisma.trial.create({
      data: {
        org_id: req.user.orgId,
        user_id: req.user.id,
        product_id: productId,
        edition_id: targetEditionId,
        status: 'PENDING_APPROVAL',
        node_limit: parseInt(nodeLimit, 10) || 100,
        notes: notes || 'Evaluation request from customer portal'
      },
      include: {
        product: true,
        edition: true
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'TRIAL_REQUESTED',
      target: `Trial:${product.name}`,
      metadata: { trialId: trial.id, nodeLimit: trial.node_limit },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'Trial request submitted. GTS Solution Engineering team will review and approve shortly.',
      data: trial
    });
  } catch (err) {
    next(err);
  }
};

// Admin Approve Trial
exports.approveTrial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { durationDays = 30 } = req.body;

    const trial = await prisma.trial.findUnique({
      where: { id },
      include: {
        organization: true,
        product: true,
        edition: true
      }
    });

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    // Create Subscription, Entitlement, and Signed License for Trial
    const result = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          org_id: trial.org_id,
          product_id: trial.product_id,
          start_date: startDate,
          end_date: expiryDate,
          support_plan: 'Standard Evaluation Support',
          status: 'TRIALING'
        }
      });

      const ent = await tx.entitlement.create({
        data: {
          subscription_id: sub.id,
          edition_id: trial.edition_id,
          metric_type: 'NODES',
          metric_limit: trial.node_limit,
          activation_limit: 2,
          features: trial.edition.feature_profile
        }
      });

      const licenseKey = licenseSigner.generateLicenseKey(trial.product.code, 'TRL');
      const payload = {
        license_key: licenseKey,
        organization: { id: trial.organization.id, legal_name: trial.organization.legal_name },
        product: { id: trial.product.id, code: trial.product.code, name: trial.product.name },
        edition: { id: trial.edition.id, code: trial.edition.code, name: trial.edition.name },
        entitlement: { metric_type: 'NODES', metric_limit: trial.node_limit, activation_limit: 2 },
        license_type: 'TRIAL',
        validity: { issued_at: startDate.toISOString(), expires_at: expiryDate.toISOString() }
      };

      const { signedPayload, signature, keyId } = licenseSigner.signLicense(payload);

      const license = await tx.license.create({
        data: {
          entitlement_id: ent.id,
          license_type: 'TRIAL',
          license_key: licenseKey,
          issue_date: startDate,
          expiry_date: expiryDate,
          signing_key_id: keyId,
          status: 'ACTIVE',
          signed_payload: signedPayload,
          signature: signature
        }
      });

      const updatedTrial = await tx.trial.update({
        where: { id: trial.id },
        data: {
          status: 'ACTIVE',
          start_date: startDate,
          expiry_date: expiryDate,
          license_id: license.id
        },
        include: {
          license: true,
          product: true,
          edition: true
        }
      });

      return updatedTrial;
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: trial.org_id,
      action: 'ADMIN_TRIAL_APPROVED',
      target: `Trial:${trial.product.name}`,
      metadata: { trialId: trial.id, licenseId: result.license_id },
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Trial approved and cryptographic evaluation license issued',
      data: result
    });
  } catch (err) {
    next(err);
  }
};

exports.convertTrial = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trial = await prisma.trial.findUnique({
      where: { id },
      include: { product: true, organization: true }
    });

    if (!trial) {
      return res.status(404).json({ success: false, message: 'Trial not found' });
    }

    const updated = await prisma.trial.update({
      where: { id },
      data: { status: 'CONVERTED' }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: trial.org_id,
      action: 'TRIAL_CONVERTED_COMMERCIAL',
      target: `Trial:${trial.product.name}`,
      req
    });

    return res.status(200).json({
      success: true,
      message: 'Conversion inquiry registered. A commercial quotation is being generated.',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
