export function schemaValidationMiddleware(schema) {
	return (req, res, next) => {
		const validation = schema.validate(req.body, { abortEarly: false });

		if (validation.error) {
			const errors = validation.error.details.map((error) => error.message);

			res.status(400).send(errors);
			return;
		}

		next();
	};
}
