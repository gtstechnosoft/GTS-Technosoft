const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireOrgAdmin } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

router.get('/current', orgController.getCurrentOrg);
router.patch('/current', requireOrgAdmin, orgController.updateCurrentOrg);

router.get('/users', orgController.listOrgUsers);
router.post('/users', requireOrgAdmin, orgController.inviteOrgUser);
router.delete('/users/:userId', requireOrgAdmin, orgController.removeOrgUser);

module.exports = router;
