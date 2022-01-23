const express = require('express');

const router = express.Router();

const { findAllData, insertProductImage, findOneUsingProductId } = require('../controllers/ProductImage');

/**
 * List all product with image
 */
router.get('/', findAllData);

/**
 * List single product by ProductId
 */
router.get('/:product_id', findOneUsingProductId);

/**
 * Add image to Product
 */
router.post('/', insertProductImage);

module.exports = router;
