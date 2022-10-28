import * as searchUser from "../Repositories/searchRepository.js";

async function searchPeople(req, res) {
	const { search } = req.query;
	const { user } = res.locals;

	if (!search) return res.sendStatus(400);

	try {
		const users = (await searchUser.SearchUser({ user, search })).rows;

		res.status(200).send(users);
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

export { searchPeople, listPostsFromUser };