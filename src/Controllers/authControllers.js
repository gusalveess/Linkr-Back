import * as authRepository from "../Repositories/authRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function SignUp(req, res) {
	const { email, password, username, picture } = req.body;
	const { rows: user } = authRepository.FindUser(email);

	try {
		if (user.length === 0) {
			return res
				.sendStatus(409)
				.send("Já existe um usuário cadastrado com esse e-mail.");
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
		const token = jwt.sign(user[0].id, key);
		const sendToken = {
			token: token,
		};

		if (user.length === 0) {
			return res.status(401).send("Usuário incompátivel ou inexistente");
		}

		if (bcrypt.compareSync(password, user[0].password) == false) {
			return res.status(401).send("Senha incorreta.");
		}

		authRepository.Login(token, user[0].id);

		res.status(200).send(sendToken);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function Logout(req, res) {
	const token = req.headers.authorization?.replace("Bearer ", "");

	try {
		const { rows: session } = await authRepository.FindToken(token);

		if (session.length === 0) {
			return res.status(401).send("Sessão não encontrada");
		}

		if (!token) {
			return res.status(401).send("Sem Token de acesso.");
		}

		await authRepository.Finish(session[0].token);

		res.status(200);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
