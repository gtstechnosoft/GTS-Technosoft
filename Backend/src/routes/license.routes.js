const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const authMiddleware = require('../middlewares/authMiddleware');
const orgScopeMiddleware = require('../middlewares/orgScopeMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');
const { licenseRateLimiter } = require('../middlewares/rateLimiter');

router.use(authMiddleware);
router.use(orgScopeMiddleware);

router.get('/', licenseController.listLicenses);
router.get('/:id', licenseController.getLicenseById);
router.get('/:id/download', licenseRateLimiter, licenseController.downloadLicFile);
router.post('/verify', licenseController.verifyLicensePayload);

// Admin license operations
router.post('/', requireInternalAdmin, licenseController.issueLicense);
router.post('/:id/revoke', requireInternalAdmin, licenseController.revokeLicense);

module.exports = router;
