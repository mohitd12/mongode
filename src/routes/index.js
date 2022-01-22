const express = require('express');

const router = express.Router();

// custom routes
const category = require('./category');

router.use('/category', category);

module.exports = router;
