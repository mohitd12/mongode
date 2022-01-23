const express = require('express');

const router = express.Router();

const { findProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/Product');

router.get('/', findProducts);
router.post('/', createProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

module.exports = router;
