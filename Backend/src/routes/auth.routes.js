const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { authRateLimiter } = require('../middlewares/rateLimiter');

router.post('/register', authRateLimiter, authController.register);
router.post('/login', authRateLimiter, authController.login);
router.post('/refresh', authController.refreshToken);
router.get('/me', authMiddleware, authController.getMe);

// MFA endpoints
router.post('/mfa/setup', authMiddleware, authController.setupMfa);
router.post('/mfa/verify', authMiddleware, authController.verifyAndEnableMfa);
router.post('/mfa/disable', authMiddleware, authController.disableMfa);

module.exports = router;
