const express = require('express');

const router = express.Router();

const { findProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/Product');

/**
 * List all products
 */
router.get('/', findProducts);

/**
 * Create new product
 */
router.post('/', createProduct);

/**
 * Update existing product by ID
 */
router.put('/:productId', updateProduct);

/**
 * Remove product by ID
 */
router.delete('/:productId', deleteProduct);

module.exports = router;
