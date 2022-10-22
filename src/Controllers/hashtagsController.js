import * as hashtagsRepository from "../Repositories/hashtagsRepository.js";

export async function ListHashtags(req, res) {
	try {
		const hashtags = (await hashtagsRepository.ListHashtags()).rows;

		res.status(200).send(hashtags);
	} catch (error) {
		console.log(error);
		res.sendStatus(500);
	}
}
