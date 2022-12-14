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
	const { page, after } = req.query;

	const currentPage = page * 10;

	try {
		const posts = after
			? (await postsRepository.ListPostsAfterId({ user, after })).rows
			: (await postsRepository.ListPosts({ user, page: currentPage })).rows;

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
	const { page } = req.query;

	const currentPage = page * 10;

	try {
		const posts = (
			await postsRepository.ListPostsWithHashtag({
				user,
				hashtag,
				page: currentPage,
			})
		).rows;

		res.status(200).send(posts);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function Repost(req, res) {
	const { id } = req.params;
	const { user } = res.locals;

	if (isNaN(id)) return res.sendStatus(400);

	try {
		const sharedPost = (await postsRepository.Repost({ id, user })).rowCount;

		if (sharedPost === 0) {
			return res.status(400).send("Não foi possível compartilhar o post.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function ToggleLike(req, res) {
	const { id } = req.params;
	const { user } = res.locals;

	if (isNaN(id)) return res.sendStatus(400);

	try {
		const result = (await postsRepository.Like({ id, user })).rowCount;

		if (result === 0) {
			return res.status(400).send("Não foi possível realizar a ação.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function InsertComment(req, res) {
	const { id } = req.params;
	const { comment } = req.body;
	const { user } = res.locals;

	if (isNaN(id) || !comment) return res.sendStatus(400);

	try {
		const result = (await postsRepository.InsertComment({ id, user, comment }))
			.rowCount;

		if (result === 0) {
			return res.status(400).send("Não foi possível comentar o post.");
		}

		res.sendStatus(204);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}

export async function ListComments(req, res) {
	const { id } = req.params;
	const { user } = res.locals;

	if (isNaN(id)) return res.sendStatus(400);

	try {
		const comments = (await postsRepository.ListComments({ id, user })).rows;

		res.status(200).send(comments);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
