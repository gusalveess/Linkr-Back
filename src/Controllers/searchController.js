import * as searchUser from "../Repositories/searchRepository.js";

async function searchId(req, res) {
	const id = req.params.id;

	try {
		const result = await searchUser.search(id);

		if (result.rowCount === 0) {
			return res.sendStatus(404);
		}

		res.send(result.rows);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
}

async function listPostsFromUser(req, res) {
	const { id } = req.params;
	const { page } = req.query;
	const { user } = res.locals;

	const currentPage = page * 10;

	try {
		const result = await searchUser.PostsFromUser({
			id,
			page: currentPage,
			user,
		});

		res.send(result.rows);
	} catch (error) {
		console.log(error);
		return res.sendStatus(500);
	}
}

export { searchId, listPostsFromUser };
