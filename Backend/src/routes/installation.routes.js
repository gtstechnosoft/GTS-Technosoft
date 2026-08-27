const express = require('express');
const router = express.Router();
const installationController = require('../controllers/installationController');
const authMiddleware = require('../middlewares/authMiddleware');
const orgScopeMiddleware = require('../middlewares/orgScopeMiddleware');

// Heartbeat endpoint can be called by agent/daemon
router.post('/:id/heartbeat', installationController.sendHeartbeat);

// Protected routes
router.use(authMiddleware);
router.use(orgScopeMiddleware);

router.get('/', installationController.listInstallations);
router.post('/', installationController.registerInstallation);
router.delete('/:id', installationController.deleteInstallation);

module.exports = router;
