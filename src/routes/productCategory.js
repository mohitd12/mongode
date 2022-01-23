const express = require('express');

const router = express.Router();

const { findAllData, addCategoryToProduct } = require('../controllers/ProductCategory');

/**
 * List all product with categories
 */
router.get('/', findAllData);

/**
 * Add category to product
 */
router.post('/', addCategoryToProduct);

module.exports = router;
