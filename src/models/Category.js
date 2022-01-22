const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	name: { type: String, trim: true },
	description: { type: String, trim: true },
	image_url: { type: String, trim: true }
});

module.exports = mongoose.model('category', schema);
