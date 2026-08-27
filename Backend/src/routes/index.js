const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const orgRoutes = require('./org.routes');
const productRoutes = require('./product.routes');
const subscriptionRoutes = require('./subscription.routes');
const licenseRoutes = require('./license.routes');
const installationRoutes = require('./installation.routes');
const releaseRoutes = require('./release.routes');
const trialRoutes = require('./trial.routes');
const supportRoutes = require('./support.routes');
const auditRoutes = require('./audit.routes');
const leadRoutes = require('./lead.routes');
const adminRoutes = require('./admin.routes');

// Mount routes to API v1
router.use('/auth', authRoutes);
router.use('/organizations', orgRoutes);
router.use('/products', productRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/entitlements', subscriptionRoutes);
router.use('/licenses', licenseRoutes);
router.use('/installations', installationRoutes);
router.use('/releases', releaseRoutes);
router.use('/trials', trialRoutes);
router.use('/support-cases', supportRoutes);
router.use('/audit-events', auditRoutes);
router.use('/leads', leadRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'GTS Technosoft AI Platform API',
    brand: 'KavachIQ',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;
