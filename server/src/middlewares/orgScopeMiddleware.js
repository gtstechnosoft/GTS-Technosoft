/**
 * Multi-Tenant Org Scope Middleware
 * Ensures queries and mutations are isolated to the authenticated user's organization.
 * For INTERNAL_ADMIN, allows specifying ?orgId= or accessing cross-tenant data.
 */
const orgScopeMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Authentication required'
    });
  }

  // If internal admin, they can optionally specify orgId in query or header, or access global
  if (req.user.role === 'INTERNAL_ADMIN') {
    req.targetOrgId = req.query.orgId || req.params.orgId || req.body.orgId || req.user.orgId;
    req.isGlobalScope = !req.query.orgId && !req.params.orgId && !req.body.orgId;
  } else {
    // Normal org users are strictly bound to their assigned organization
    req.targetOrgId = req.user.orgId;
    req.isGlobalScope = false;

    // Reject if request params try to inject another orgId
    if (req.params.orgId && req.params.orgId !== req.user.orgId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Cannot access another organization data'
      });
    }

    if (req.body && req.body.org_id && req.body.org_id !== req.user.orgId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Organization ID mismatch'
      });
    }
  }

  next();
};

module.exports = orgScopeMiddleware;
