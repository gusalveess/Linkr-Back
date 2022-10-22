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

export async function DeletePost(req, res) {
	const { id } = req.params;
	const { user } = res.locals;

	if (isNaN(id)) return res.sendStatus(400);

	try {
		const post = (await postsRepository.SearchPost(id)).rows[0];

		if (!post) return res.sendStatus(404);

		if (post.userId !== user) return res.sendStatus(401);

		const deletedPost = (await postsRepository.DeletePost(id)).rowCount;

		if (deletedPost === 0) {
			return res.status(400).send("Não foi possível excluir o post.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function EditPost(req, res) {
	const { id } = req.params;
	const { description, tags } = req.body;
	const { user } = res.locals;

	if (isNaN(id)) return res.sendStatus(400);

	if (!Array.isArray(tags)) {
		return res.status(400).send("Tags no formato errado.");
	}

	try {
		const post = (await postsRepository.SearchPost(id)).rows[0];

		if (!post) return res.sendStatus(404);

		if (post.userId !== user) return res.sendStatus(401);

		const editedPost = (
			await postsRepository.EditPost({ tags, id, description })
		).rowCount;

		if (editedPost === 0) {
			return res.status(400).send("Não foi possível editar o post.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function ListPostsWithHashtag(req, res) {
	const { hashtag } = req.params;
	const { user } = res.locals;

	try {
		const posts = (
			await postsRepository.ListPostsWithHashtag({ user, hashtag })
		).rows;

		res.status(200).send(posts);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
