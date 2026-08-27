const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const authMiddleware = require('../middlewares/authMiddleware');
const orgScopeMiddleware = require('../middlewares/orgScopeMiddleware');

router.use(authMiddleware);
router.use(orgScopeMiddleware);

router.get('/', supportController.listSupportCases);
router.post('/', supportController.createSupportCase);
router.patch('/:id', supportController.updateSupportCase);

module.exports = router;
