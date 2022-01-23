const mongoose = require('mongoose');
const Joi = require('joi');

const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductCategory = require('../models/ProductCategory');

// body validation schema for Product
const bodyValidationSchema = Joi.object({
	product_id: Joi.string().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"product_id" must be a valid objectId');
		}
		return true;
	}),
	category_id: Joi.string().required().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"category_id" must be a valid objectId');
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

let productCategoryController = {};

/**
 * List all categories with products
 */
productCategoryController.findAllData = (req, res, next) => {
	ProductCategory.find({}).populate('product_id').populate('category_id').exec((err, doc) => {
		if (err) return next(err);

		if (doc.length < 1) return res.status(200).json({ message: 'No data found' });

		res.status(200).json({ message: 'Data found', data: doc });
	});
};

/**
 * Add category to product
 */
productCategoryController.addCategoryToProduct = (req, res, next) => {
	// validate request body against schema
	const { error } = bodyValidationSchema.validate(req.body, validateOptions);

	if (error) {
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });
	}

	Product.findById(req.body.product_id, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No product exist with Id: ${req.body.product_id}` });

		Category.findById(req.body.category_id, (err, doc) => {
			if (err) return next(err);

			if (!doc) return res.status(200).json({ message: `No category exist with Id: ${req.body.product_id}` });

			ProductCategory.create(req.body, (err, doc) => {
				if (err) return next(err);

				res.status(200).json({ message: 'Category added to product', data: doc });
			});
		});
	});
};

module.exports = productCategoryController;
