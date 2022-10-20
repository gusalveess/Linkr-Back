import * as postsRepository from "../Repositories/postsRepository.js";

const urlRegex = new RegExp(
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
);

export async function Publish(req, res) {
	const { url, description = "", tags } = req.body;
	const { user } = res.locals;

	if (!url.match(urlRegex)) {
		return res.status(400).send("Url inválida.");
	}

	if (!Array.isArray(tags)) {
		return res.status(400).send("Tags no formato errado.");
	}

	try {
		await postsRepository.CreatePost({ user, url, description, tags });

		res.sendStatus(201);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function ListPosts(req, res) {
	const { user } = res.locals;

	try {
		const posts = (await postsRepository.ListPosts({ user })).rows;

		res.status(200).send(posts);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
