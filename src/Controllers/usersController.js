import * as usersRepository from "../Repositories/usersRepository.js";

export async function ToggleFollow(req, res) {
	const { userId } = req.params;
	const { user } = res.locals;

	if (isNaN(userId)) return res.sendStatus(400);

	try {
		const result = (await usersRepository.Follow({ userId, user })).rowCount;

		if (result === 0) {
			return res.status(400).send("Não foi possível executar a operação.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
