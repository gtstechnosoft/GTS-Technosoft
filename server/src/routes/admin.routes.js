const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(requireInternalAdmin);

router.get('/dashboard-stats', adminController.getAdminDashboardStats);
router.get('/organizations', adminController.listAllOrganizations);
router.post('/organizations', adminController.createOrganization);
router.patch('/organizations/:id/status', adminController.updateOrganizationStatus);

module.exports = router;
