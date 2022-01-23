const mongoose = require('mongoose');
const Joi = require('joi');

const Product = require('../models/Product');
const ProductImage = require('../models/ProductImage');

// body validation schema for Product
const bodyValidationSchema = Joi.object({
	product_id: Joi.string().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"product_id" must be a valid objectId');
		}
		return true;
	}),
	image_url: Joi.string().uri().required()
});

// params validation schema for Product
const paramsValidationSchema = Joi.object({
	product_id: Joi.string().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"product_id" must be a valid objectId');
		}
		return true;
	})
});

// validate options
const validateOptions = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true // remove unknown props
};

let productImageController = {};

/**
 * Find all data
 */
productImageController.findAllData = (req, res, next) => {
	ProductImage.find({}).populate('product_id').exec((err, doc) => {
		if (err) return next(err);

		if (doc.length < 1) return res.status(200).json({ message: 'No data found' });

		res.status(200).json({ message: 'Data found', data: doc });
	});
};

/**
 * Insert product image
 */
productImageController.insertProductImage = (req, res, next) => {
	// validate request body against schema
	const { error } = bodyValidationSchema.validate(req.body, validateOptions);

	if (error) {
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });
	}

	Product.findById(req.body.product_id, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No product exist with Id: ${req.body.product_id}` });

		if (doc) return res.status(200).json({ message: `Product already exist with Id: ${req.body.product_id}` });

		ProductImage.create(req.body, (err, doc) => {
			if (err) return next(err);
			res.status(200).json({ message: 'Product image inserted', data: doc });
		});
	});
};

/**
 * Find one with ProductId
 */
productImageController.findOneUsingProductId = (req, res, next) => {
	// validate request body against schema
	const { error } = paramsValidationSchema.validate(req.params, validateOptions);

	if (error) {
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });
	}

	ProductImage.findOne({ product_id: req.params.product_id }).populate('product_id').exec((err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No product exist with Id: ${req.params.product_id}` });

		res.status(200).json({ message: 'Product found', data: doc });
	});
};

module.exports = productImageController;
