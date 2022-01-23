const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');

// model
const Product = require('../models/Product');

// body validation schema for Product
const bodyValidationSchema = Joi.object({
	name: Joi.string().required(),
	sku: Joi.string().regex(/^[a-zA-Z0-9]*$/, 'alphanumeric').required(),
	price: Joi.number().min(0).allow(0).required()
});

/**
 * body validation schema for Product
 * without SKU field
 */
const bodyValidationSchema1 = Joi.object({
	name: Joi.string(),
	price: Joi.number().min(0).allow(0)
});

// route params validation schema for Product
const paramsValidationSchema = Joi.object({
	productId: Joi.string().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"productId" must be a valid objectId');
		}
		return true;
	})
});

// query params validation schema for Product
const queryValidationSchema = Joi.object({
	page: Joi.number().integer().min(0).required(),
	limit: Joi.number().integer().min(0).required(),
	sortBy: Joi.string()
});

// validation options
const validateOptions = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true // remove unknown props
};

/**
 * Product controller
 */
let productController = {};

/**
 * Find all products
 * with basic filters
 */
productController.findProducts = async (req, res, next) => {
	// validate request query against schema
	const { error } = queryValidationSchema.validate(req.query, validateOptions);

	if (error) {
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });
	}

	let pageOptions = {},
		sortOptions = {};

	if (_.has(req.query, 'page')) {
		pageOptions['page'] = req.query.page;
	}

	if (_.has(req.query, 'limit')) {
		pageOptions['limit'] = req.query.limit;
	}

	if (_.has(req.query, 'sortBy')) {
		const sortValue = req.query.sortBy.split(':');
		sortOptions[sortValue[0]] = sortValue[1] === 'desc' ? -1 : 1;
	}

	Product.find({})
		.limit(pageOptions.limit)
		.skip(pageOptions.limit * pageOptions.page)
		.sort(sortOptions)
		.exec((err, doc) => {
			if (err) return next(err);

			if (doc.length < 1) return res.status(200).json({ message: 'No data found', data: doc });

			res.status(200).json({ message: 'Data found', data: doc });
		});
};

/**
 * Create product
 */
productController.createProduct = async (req, res, next) => {
	// validate request body against schema
	const { error } = bodyValidationSchema.validate(req.body, validateOptions);

	if (error)
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });

	Product.create(req.body, (err, doc) => {
		if (err) return next(err);
		res.status(200).json({ message: 'Product created', data: doc });
	});
};

/**
 * Update product
 */
productController.updateProduct = async (req, res, next) => {
	// validate request params against schema
	const paramValidationRes = paramsValidationSchema.validate(req.params, validateOptions);

	if (paramValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${paramValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	// validate request body against schema
	const bodyValidationRes = bodyValidationSchema1.validate(req.body, validateOptions);

	if (bodyValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${bodyValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	Product.findByIdAndUpdate(req.params.productId, req.body, { new: true }, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No product exist with Id: ${req.params.productId}` });

		res.status(200).json({ message: 'Product updated', data: doc });
	});
};

/**
 * Delete product
 */
productController.deleteProduct = async (req, res, next) => {
	// validate request params against schema
	const paramValidationRes = paramsValidationSchema.validate(req.params, validateOptions);

	if (paramValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${paramValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	Product.findByIdAndRemove(req.params.productId, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No product exist with Id: ${req.params.productId}` });

		res.status(200).json({ message: 'Product removed', data: doc });
	});
};

module.exports = productController;
