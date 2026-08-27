const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

// Public lead capture
router.post('/', leadController.createLead);

// Admin lead management
router.get('/', authMiddleware, requireInternalAdmin, leadController.listLeads);
router.patch('/:id/status', authMiddleware, requireInternalAdmin, leadController.updateLeadStatus);

module.exports = router;
