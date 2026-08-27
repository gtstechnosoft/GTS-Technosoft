const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

const SLA_HOURS = {
  P1_CRITICAL: 2,
  P2_HIGH: 4,
  P3_MEDIUM: 8,
  P4_LOW: 24
};

exports.listSupportCases = async (req, res, next) => {
  try {
    const where = req.user.role === 'INTERNAL_ADMIN' && !req.query.orgId
      ? {}
      : { org_id: req.targetOrgId || req.user.orgId };

    const cases = await prisma.supportCase.findMany({
      where,
      include: {
        organization: true,
        creator: {
          select: { id: true, email: true, first_name: true, last_name: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: cases });
  } catch (err) {
    next(err);
  }
};

exports.createSupportCase = async (req, res, next) => {
  try {
    const { subject, description, severity } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: 'Subject and description are required' });
    }

    const selectedSeverity = severity || 'P3_MEDIUM';
    const slaHours = SLA_HOURS[selectedSeverity] || 8;

    const supportCase = await prisma.supportCase.create({
      data: {
        org_id: req.user.orgId,
        created_by: req.user.id,
        subject,
        description,
        severity: selectedSeverity,
        status: 'NEW',
        sla_target_hours: slaHours
      },
      include: {
        creator: {
          select: { id: true, email: true, first_name: true, last_name: true }
        }
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: req.user.orgId,
      action: 'SUPPORT_CASE_CREATED',
      target: `Case:${supportCase.id} (${supportCase.severity})`,
      metadata: { subject: supportCase.subject },
      req
    });

    return res.status(201).json({
      success: true,
      message: `Support ticket #${supportCase.id.substring(0, 8)} opened. SLA Response Target: ${slaHours} hours.`,
      data: supportCase
    });
  } catch (err) {
    next(err);
  }
};

exports.updateSupportCase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes, assignedTo } = req.body;

    const currentCase = await prisma.supportCase.findUnique({
      where: { id }
    });

    if (!currentCase) {
      return res.status(404).json({ success: false, message: 'Support case not found' });
    }

    if (req.user.role !== 'INTERNAL_ADMIN' && currentCase.org_id !== req.user.orgId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updated = await prisma.supportCase.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolutionNotes && { resolution_notes: resolutionNotes }),
        ...(assignedTo && { assigned_to: assignedTo })
      },
      include: {
        creator: true,
        organization: true
      }
    });

    await auditService.logEvent({
      actorId: req.user.id,
      orgId: updated.org_id,
      action: 'SUPPORT_CASE_UPDATED',
      target: `Case:${updated.id}`,
      metadata: { status: updated.status },
      req
    });

    return res.status(200).json({ success: true, message: 'Support case updated', data: updated });
  } catch (err) {
    next(err);
  }
};
