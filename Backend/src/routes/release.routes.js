const express = require('express');
const router = express.Router();
const releaseController = require('../controllers/releaseController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

// Public or signed download verification
router.get('/:id/download', releaseController.downloadPackage);

// Authenticated listing and signed download URL generation
router.use(authMiddleware);

router.get('/', releaseController.listReleases);
router.get('/:id', releaseController.getReleaseById);
router.get('/:id/download-token', releaseController.generateDownloadToken);

// Admin publish
router.post('/', requireInternalAdmin, releaseController.createRelease);

module.exports = router;
