const express = require('express');

const router = express.Router();

const { findCategories, createCategory, updateCategory, removeCategory } = require('../controllers/Category');

router.get('/', findCategories);
router.post('/', createCategory);
router.put('/:categoryId', updateCategory);
router.delete('/:categoryId', removeCategory);

module.exports = router;
