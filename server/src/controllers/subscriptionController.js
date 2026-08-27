const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.listSubscriptions = async (req, res, next) => {
  try {
    const where = req.user.role === 'INTERNAL_ADMIN' && !req.query.orgId 
      ? {} 
      : { org_id: req.targetOrgId || req.user.orgId };

    const subscriptions = await prisma.subscription.findMany({
      where,
      include: {
        organization: true,
        product: {
          include: {
            editions: true
          }
        },
        entitlements: {
          include: {
            edition: true,
            licenses: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: subscriptions });
  } catch (err) {
    next(err);
  }
};

exports.listEntitlements = async (req, res, next) => {
  try {
    const orgId = req.targetOrgId || req.user.orgId;

    const entitlements = await prisma.entitlement.findMany({
      where: {
        subscription: {
          org_id: orgId
        }
      },
      include: {
        subscription: {
          include: {
            product: true
          }
        },
        edition: true,
        licenses: {
          where: { status: 'ACTIVE' }
        }
      }
    });

    return res.status(200).json({ success: true, data: entitlements });
  } catch (err) {
    next(err);
  }
};

// Admin create subscription & entitlement
exports.createSubscriptionWithEntitlements = async (req, res, next) => {
  try {
    const { orgId, productId, editionId, startDate, endDate, supportPlan, metricType, metricLimit, activationLimit, features } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          org_id: orgId,
          product_id: productId,
          start_date: new Date(startDate || Date.now()),
          end_date: new Date(endDate || Date.now() + 365 * 24 * 60 * 60 * 1000),
          support_plan: supportPlan || '24x7 Enterprise Platinum',
          status: 'ACTIVE'
        }
      });

      const ent = await tx.entitlement.create({
        data: {
          subscription_id: sub.id,
          edition_id: editionId,
          metric_type: metricType || 'NODES',
          metric_limit: parseInt(metricLimit, 10) || 500,
          activation_limit: parseInt(activationLimit, 10) || 5,
          features: features || {}
        }
      });

      return { sub, ent };
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: orgId,
      action: 'ADMIN_SUBSCRIPTION_GRANTED',
      target: `Subscription:${result.sub.id}`,
      metadata: { productId, editionId, metricLimit },
      req
    });

    return res.status(201).json({ success: true, message: 'Subscription & Entitlement created', data: result });
  } catch (err) {
    next(err);
  }
};
