const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
		category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'category' }
	},
	{ versionKey: false }
);

module.exports = mongoose.model('product_category', schema);
