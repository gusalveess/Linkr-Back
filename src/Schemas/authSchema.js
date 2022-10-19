import joi from "joi";

const pattern = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/;

const signUpSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.required(),
	username: joi.string().required(),
	picture: joi.string().pattern(pattern).required(),
});

const signInSchema = joi.object({
	email: joi.string().email().required(),
	password: joi.required(),
});

export { signUpSchema, signInSchema };
