const Joi = require('joi');
const mongoose = require('mongoose');

// model
const Category = require('../models/Category');

// body validation schema for Category
const bodyValidationSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required().allow(''),
	image_url: Joi.string().uri().required().allow('')
});

// route params validation schema for Category
const paramsValidationSchema = Joi.object({
	categoryId: Joi.string().custom((val, helper) => {
		if (!mongoose.Types.ObjectId.isValid(val)) {
			return helper.message('"categoryId" must be a valid objectId');
		}
		return true;
	})
});

// validation options
const validateOptions = {
	abortEarly: false, // include all errors
	allowUnknown: true, // ignore unknown props
	stripUnknown: true // remove unknown props
};

/**
 * Category controller
 */
let categoryController = {};

/**
 * Find all categories 
 */
categoryController.findCategories = async (req, res, next) => {
	Category.find({}, (err, doc) => {
		if (err) return next(err);

		if (doc.length < 1) return res.status(200).json({ message: 'No data found', data: doc });

		res.status(200).json({ message: 'Data found', data: doc });
	});
};

/**
 * Create category
 */
categoryController.createCategory = async (req, res, next) => {
	// validate request body against schema
	const { error } = bodyValidationSchema.validate(req.body, validateOptions);

	if (error) {
		return res.status(400).json({ message: `Validation error: ${error.details.map((err) => err.message).join(', ')}` });
	}

	Category.create(req.body, (err, doc) => {
		if (err) return next(err);

		res.status(200).json({ message: 'Category created', data: doc });
	});
};

/**
 * Update category by categoryId
 */
categoryController.updateCategory = async (req, res, next) => {
	// validate request params against schema
	const paramValidationRes = paramsValidationSchema.validate(req.params, validateOptions);

	if (paramValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${paramValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	// validate request body against schema
	const bodyValidationRes = bodyValidationSchema.validate(req.body, validateOptions);

	if (bodyValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${bodyValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	Category.findByIdAndUpdate(req.params.categoryId, req.body, { new: true }, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No category exist with Id: ${req.params.categoryId}` });

		res.status(200).json({ message: 'Category updated', data: doc });
	});
};

/**
 * Delete category by categoryId
 */
categoryController.removeCategory = async (req, res, next) => {
	// validate request params against schema
	const paramValidationRes = paramsValidationSchema.validate(req.params, validateOptions);

	if (paramValidationRes.error) {
		return res
			.status(400)
			.json({ message: `Validation error: ${paramValidationRes.error.details.map((err) => err.message).join(', ')}` });
	}

	Category.findByIdAndRemove(req.params.categoryId, (err, doc) => {
		if (err) return next(err);

		if (!doc) return res.status(200).json({ message: `No category exist with Id: ${req.params.categoryId}` });

		res.status(200).json({ message: 'Category removed', data: doc });
	});
};

module.exports = categoryController;
