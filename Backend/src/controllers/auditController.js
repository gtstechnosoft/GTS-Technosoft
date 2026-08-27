const prisma = require('../config/prisma');

exports.listAuditEvents = async (req, res, next) => {
  try {
    const { actorId, action, target, startDate, endDate, limit = 100, page = 1 } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const where = {
      ...(req.user.role !== 'INTERNAL_ADMIN' && { org_id: req.user.orgId }),
      ...(req.user.role === 'INTERNAL_ADMIN' && req.query.orgId && { org_id: req.query.orgId }),
      ...(actorId && { actor_id: actorId }),
      ...(action && { action: { contains: action, mode: 'insensitive' } }),
      ...(target && { target: { contains: target, mode: 'insensitive' } }),
      ...(startDate && { created_at: { gte: new Date(startDate) } }),
      ...(endDate && { created_at: { lte: new Date(endDate) } })
    };

    const [total, events] = await Promise.all([
      prisma.auditEvent.count({ where }),
      prisma.auditEvent.findMany({
        where,
        include: {
          actor: {
            select: { id: true, email: true, first_name: true, last_name: true, role: true }
          },
          organization: {
            select: { id: true, legal_name: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
        events
      }
    });
  } catch (err) {
    next(err);
  }
};
