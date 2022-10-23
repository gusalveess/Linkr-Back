import * as authRepository from "../Repositories/authRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function SignUp(req, res) {
	const { email, password, username, picture } = req.body;

	try {
		const { rows: user } = await authRepository.FindUser(email, username);

		if (user.length > 0) {
			return res.status(409).send("Usuário já existe.");
		}

		const passwordHash = bcrypt.hashSync(password, 13);

		authRepository.CreateUser(email, passwordHash, username, picture);

		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function SignIn(req, res) {
	const { email, password } = req.body;
	const key = process.env.JWT_SECRET;

	try {
		const { rows: user } = await authRepository.FindUser(email);

		if (user.length === 0) {
			return res.status(401).send("Usuário incompátivel ou inexistente.");
		}

		const token = jwt.sign({ user: user[0].id }, key);

		if (bcrypt.compareSync(password, user[0].password) == false) {
			return res.status(401).send("Usuário incompatível ou inexistente.");
		}

		authRepository.Login(token, user[0].id);

		res.status(200).send({ userImage: user[0].picture, token });
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function Logout(req, res) {
	const { session } = res.locals;

	try {
		await authRepository.Finish(session[0].token);

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
