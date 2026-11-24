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
  /*
  The following function throws an error if the length of the contributor list is not equal to the length of the image list plus one (cover image contributor) 
  */
  const equalContributerImageRule = (payload, helpers) => {
    const imageCount =
      (payload.cover_image ? 1 : 0) + (payload.other_images?.length || 0);

    const contributorCount = payload.cover_image_contributor?.length ?? 0;
    if (imageCount !== contributorCount) {
      return helpers.message({
        custom: `cover_image_contributor must contain ${imageCount} contributor(s)`,
      });
    }
    console.log("Validation triggered!");
    return payload;
  };

  const schema = Joi.object({
    text: Joi.string().required(),
    title: Joi.string().min(6).max(512).required(),
    contributors: Joi.array().min(1).items(Joi.string()).required(),
    volume: Joi.number().min(99).max(200).required(),
    issue: Joi.number().min(0).max(75).required(),
    section_id: Joi.number().min(0).max(20).required(),
    summary: Joi.string().required(),
    cover_image: Joi.string().uri().optional(),
    cover_image_contributor: Joi.array().items(Joi.string()).optional(),
    other_images: Joi.array().items(Joi.string().uri()).optional(),
    sub_section: Joi.string().max(32).optional(),
    article_type: Joi.string().required(),
  }).custom(equalContributerImageRule);

  //validate data
  const validation = schema.validate(data);
  return validation;
};
// Create Staff Validation
const createStaffValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(128).required(),
    email: Joi.string().min(6).max(255).required().email(),
    description: Joi.string().optional().min(1).max(400),
  });

  //validate data
  const validation = schema.validate(data);
  return validation;
};
module.exports = {
  registerValidation,
  loginValidation,
  draftValidation,
  createStaffValidation,
};
