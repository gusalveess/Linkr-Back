import db from "../Database/database.js";

async function CreatePostHashtags({ user, tags }) {
	const post = (
		await db.query(
			`SELECT id FROM posts WHERE "userId" = $1 ORDER BY id DESC;`,
			[user]
		)
	).rows[0].id;

	for (const tag of tags) {
		await db.query(
			`INSERT INTO
				"postHashtags"
			("hashtagId", "postId")
			VALUES ($1, $2);`,
			[tag, post]
		);
	}
}

async function CreatePost({ user, url, description, tags }) {
	const result = await db.query(
		`INSERT INTO posts ("userId", url, description) VALUES ($1, $2, $3);`,
		[user, url, description]
	);

	await CreatePostHashtags({ user, tags });

	return result;
}

export { CreatePost };
