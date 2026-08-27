const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrgs,
      totalUsers,
      totalSubscriptions,
      activeLicenses,
      activeInstallations,
      pendingTrials,
      openSupportCases,
      recentAuditEvents
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.license.count({ where: { status: 'ACTIVE' } }),
      prisma.installation.count({ where: { activation_status: 'ACTIVE' } }),
      prisma.trial.count({ where: { status: 'PENDING_APPROVAL' } }),
      prisma.supportCase.count({ where: { status: { in: ['NEW', 'IN_PROGRESS', 'WAITING_ON_CUSTOMER'] } } }),
      prisma.auditEvent.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        include: {
          actor: { select: { email: true, first_name: true, last_name: true } },
          organization: { select: { legal_name: true } }
        }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalOrgs,
        totalUsers,
        totalSubscriptions,
        activeLicenses,
        activeInstallations,
        pendingTrials,
        openSupportCases,
        recentAuditEvents
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.listAllOrganizations = async (req, res, next) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            users: true,
            subscriptions: true,
            installations: true,
            support_cases: true,
            trials: true
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
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: orgs });
  } catch (err) {
    next(err);
  }
};

exports.createOrganization = async (req, res, next) => {
  try {
    const { legalName, displayName, billingCountry, domain, tier } = req.body;

    if (!legalName) {
      return res.status(400).json({ success: false, message: 'Legal organization name required' });
    }

    const org = await prisma.organization.create({
      data: {
        legal_name: legalName,
        display_name: displayName || legalName,
        billing_country: billingCountry || 'India',
        domain: domain || null,
        tier: tier || 'Enterprise',
        status: 'ACTIVE'
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: org.id,
      action: 'ADMIN_ORG_CREATED',
      target: `Organization:${org.legal_name}`,
      metadata: { tier: org.tier },
      req
    });

    return res.status(201).json({ success: true, message: 'Organization created', data: org });
  } catch (err) {
    next(err);
  }
};

exports.updateOrganizationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, tier } = req.body;

    const updated = await prisma.organization.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(tier && { tier })
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: updated.id,
      action: 'ADMIN_ORG_STATUS_MODIFIED',
      target: `Organization:${updated.legal_name}`,
      metadata: { status, tier },
      req
    });

    return res.status(200).json({ success: true, message: 'Organization status updated', data: updated });
  } catch (err) {
    next(err);
  }
};
