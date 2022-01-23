const express = require('express');

const router = express.Router();

router.use('/category', require('./category'));
router.use('/product', require('./product'));
router.use('/product-category', require('./productCategory'));

module.exports = router;
