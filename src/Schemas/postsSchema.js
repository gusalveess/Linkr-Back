import joi from "joi";

const postSchema = joi.object({
	url: joi.string().required(),
	description: joi.string(),
	tags: joi.required(),
});

export { postSchema };
