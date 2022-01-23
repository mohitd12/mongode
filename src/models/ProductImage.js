const mongoose = require('mongoose');

const schema = new mongoose.Schema(
	{
		product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
		image_url: { type: String }
	},
	{ versionKey: false }
);

module.exports = mongoose.model('product_image', schema);
