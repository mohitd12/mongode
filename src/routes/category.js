const express = require('express');

const router = express.Router();

const { findCategories, createCategory, updateCategory, removeCategory } = require('../controllers/Category');

/**
 * List all categories
 */
router.get('/', findCategories);

/**
 * Create new category
 */
router.post('/', createCategory);

/**
 * Update existing category by ID
 */
router.put('/:categoryId', updateCategory);

/**
 * Delete category by ID
 */
router.delete('/:categoryId', removeCategory);

module.exports = router;
