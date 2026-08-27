const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middlewares/authMiddleware');
const orgScopeMiddleware = require('../middlewares/orgScopeMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(orgScopeMiddleware);

router.get('/', subscriptionController.listSubscriptions);
router.get('/entitlements', subscriptionController.listEntitlements);
router.post('/', requireInternalAdmin, subscriptionController.createSubscriptionWithEntitlements);

module.exports = router;
