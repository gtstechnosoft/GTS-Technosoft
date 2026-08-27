const prisma = require('../config/prisma');

class AuditService {
  /**
   * Log an audit event
   */
  async logEvent({ actorId, orgId, action, target, metadata = {}, req = null }) {
    try {
      const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || null) : null;
      const userAgent = req ? (req.headers['user-agent'] || null) : null;

      const event = await prisma.auditEvent.create({
        data: {
          actor_id: actorId || null,
          org_id: orgId || null,
          action: action,
          target: target || null,
          metadata: metadata,
          ip_address: typeof ipAddress === 'string' ? ipAddress.substring(0, 100) : null,
          user_agent: typeof userAgent === 'string' ? userAgent.substring(0, 255) : null
        }
      });
      return event;
    } catch (err) {
      console.error('Failed to log audit event:', err.message);
      return null;
    }
  }
}

module.exports = new AuditService();
