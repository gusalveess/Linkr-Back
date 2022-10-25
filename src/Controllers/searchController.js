import { searchUser } from "../Repositories/searchRepository.js";

async function searchId(req, res) {
	const id = req.params.id;
	const { page } = req.query;
	console.log(id);

	const currentPage = page * 10;

	try {
		const result = await searchUser.search({ id, page: currentPage });
		console.log(result);

		if (result.rowCount === 0) {
			return res.sendStatus(404);
		}

		res.send(result.rows);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
}

export { searchId };
