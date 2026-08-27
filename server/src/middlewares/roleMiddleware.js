/**
 * Role-Based Access Control Middleware
 * Supports single role or array of allowed roles
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User authentication required'
      });
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // INTERNAL_ADMIN has superuser access across endpoints unless explicitly restricted
    if (req.user.role === 'INTERNAL_ADMIN' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden: Insufficient privileges. Required: [${roles.join(', ')}]`,
      userRole: req.user.role
    });
  };
};

const requireInternalAdmin = roleMiddleware(['INTERNAL_ADMIN']);
const requireOrgAdmin = roleMiddleware(['INTERNAL_ADMIN', 'ORG_ADMIN']);
const requireLicenseAdmin = roleMiddleware(['INTERNAL_ADMIN', 'ORG_ADMIN', 'LICENSE_ADMIN']);
const requireSoftwareAdmin = roleMiddleware(['INTERNAL_ADMIN', 'ORG_ADMIN', 'SOFTWARE_ADMIN']);

module.exports = {
  roleMiddleware,
  requireInternalAdmin,
  requireOrgAdmin,
  requireLicenseAdmin,
  requireSoftwareAdmin
};
