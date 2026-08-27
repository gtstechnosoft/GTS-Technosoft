const express = require('express');
const router = express.Router();
const trialController = require('../controllers/trialController');
const authMiddleware = require('../middlewares/authMiddleware');
const orgScopeMiddleware = require('../middlewares/orgScopeMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(orgScopeMiddleware);

router.get('/', trialController.listTrials);
router.post('/request', trialController.requestTrial);
router.post('/:id/convert', trialController.convertTrial);

// Admin actions
router.post('/:id/approve', requireInternalAdmin, trialController.approveTrial);

module.exports = router;
