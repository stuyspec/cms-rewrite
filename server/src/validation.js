//VALIDATION

const Joi = require("joi");

// Register Validation
const registerValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(2).max(255).required(),
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
// Register Validation
const loginValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().min(6).max(255).required().email(),
		password: Joi.string().min(6).max(1024).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
// Draft Validation
const draftValidation = (data) => {
	const schema = Joi.object({
		text: Joi.string().required(),
		title: Joi.string().min(6).max(512).required(),
		slug: Joi.string().min(6).max(512).lowercase().required(),
		contributors: Joi.array().items(Joi.string()).required(),
		volume: Joi.number().min(111).required(),
		issue: Joi.number().min(0).max(365).required(),
		section: Joi.string().required(),
		summary: Joi.string().required(),
		cover_image: Joi.string().uri().required(),
		cover_image_contributor: Joi.string().max(128).required(),
	});

	//validate data
	const validation = schema.validate(data);
	return validation;
};
module.exports = { registerValidation, loginValidation, draftValidation };
