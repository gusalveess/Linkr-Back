import jwt from "jsonwebtoken";
import * as authRepository from "../Repositories/authRepository.js";

async function validateSessionByToken(req, res, next) {
	const token = req.headers.authorization?.replace("Bearer ", "");

	if (!token) {
		return res.sendStatus(401);
	}

	try {
		jwt.verify(token, process.env.JWT_SECRET);

		const { rows: session } = await authRepository.FindToken(token);

		if (session.length === 0) {
			return res.status(401).send("Sessão não encontrada");
		}

		res.locals.token = token;
		res.locals.session = session;

		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(401);
	}
}

export { validateSessionByToken };
