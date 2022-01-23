const mongoose = require('mongoose');

/**
 * function to get price in string 
 * with two decimal places only
 * @param {*} val
 * @returns {string}
 */
function getPrice(val) {
	if (typeof val === 'number') return val.toFixed(2);
	return parseFloat(val * 1).toFixed(2);
}

const schema = new mongoose.Schema(
	{
		name: { type: String },
		sku: { type: String, index: { unique: true }, uppercase: true },
		price: { type: String, get: getPrice, default: 0 }
	},
	{ versionKey: false, toJSON: { getters: true } }
);

module.exports = mongoose.model('product', schema);
