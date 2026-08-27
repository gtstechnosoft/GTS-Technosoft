const prisma = require('../config/prisma');
const auditService = require('../services/auditService');

exports.createLead = async (req, res, next) => {
  try {
    const { fullName, email, company, phone, jobTitle, productInterest, fleetSize, message, requestType } = req.body;

    if (!fullName || !email || !company) {
      return res.status(400).json({
        success: false,
        message: 'Name, corporate email, and company are required'
      });
    }

    const lead = await prisma.lead.create({
      data: {
        full_name: fullName.trim(),
        email: email.toLowerCase().trim(),
        company: company.trim(),
        phone: phone || null,
        job_title: jobTitle || null,
        product_interest: productInterest || 'Full KavachIQ Enterprise Suite',
        fleet_size: fleetSize || 'Not specified',
        message: message || null,
        request_type: requestType || 'DEMO',
        status: 'NEW',
        ip_address: req.ip || req.headers['x-forwarded-for'] || null
      }
    });

    await auditService.logEvent({
      action: 'PUBLIC_LEAD_SUBMITTED',
      target: `Lead:${lead.email}`,
      metadata: { company: lead.company, productInterest: lead.product_interest, requestType: lead.request_type },
      req
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your request has been received. A GTS AI enterprise specialist will connect within 2 business hours.',
      data: {
        id: lead.id,
        fullName: lead.full_name,
        company: lead.company,
        productInterest: lead.product_interest
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.listLeads = async (req, res, next) => {
  try {
    const { status, requestType } = req.query;

    const leads = await prisma.lead.findMany({
      where: {
        ...(status && { status }),
        ...(requestType && { request_type: requestType })
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    return res.status(200).json({ success: true, message: 'Lead status updated', data: updated });
  } catch (err) {
    next(err);
  }
};
