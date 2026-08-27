const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');
const { requireInternalAdmin } = require('../middlewares/roleMiddleware');

// Public catalog routes
router.get('/', productController.listProducts);
router.get('/:code', productController.getProductByCode);
router.get('/:id/editions', productController.getProductEditions);

// Admin catalog modification routes
router.post('/', authMiddleware, requireInternalAdmin, productController.createProduct);
router.post('/:productId/editions', authMiddleware, requireInternalAdmin, productController.createEdition);

module.exports = router;
