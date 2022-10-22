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

async function GetLikedBy({ posts, user }) {
	for (let i = 0; i < posts.length; i++) {
		const post = posts[i];

		const likedBy = (
			await db.query(
				`SELECT
					users.username
				FROM users
				LEFT JOIN
						(SELECT 
							posts.id AS "postId", likes."byUserId"
						FROM posts
						LEFT JOIN likes
							ON likes."postId" = posts.id
						GROUP BY posts.id, likes."byUserId"
						) "likedBy"
					ON "likedBy"."byUserId" = users.id
				LEFT JOIN posts
					ON posts.id = "likedBy"."postId"
				WHERE posts.id = $1
					AND users.id <> $2
				ORDER BY posts.id DESC
				LIMIT 3;`,
				[post.id, user]
			)
		).rows;

		post.likedByUser = !!post.likedByUser;
		post.likedBy = likedBy;
		post.owner = post.owner === user;
	}
}

async function ListPosts({ user }) {
	const result = await db.query(
		`SELECT 
			posts.id, posts.url, posts.description,
			users.username AS from, users.picture AS "userImage", users.id AS owner,
			"likesTotal".count AS "likesTotal",
			"likesFromUser".count AS "likedByUser"
		FROM posts
		JOIN users
			ON posts."userId" = users.id
		LEFT JOIN
				(SELECT 
					COUNT(likes."postId"),
				 	posts.id
				FROM posts
				LEFT JOIN likes
					ON likes."postId" = posts.id
				 GROUP BY posts.id
				) "likesTotal"
			ON "likesTotal".id = posts.id
		LEFT JOIN
				(SELECT 
					COUNT(posts.id),
				 	posts.id
				FROM likes
				 JOIN posts
					ON likes."postId" = posts.id
				 WHERE likes."byUserId" = $1
				 GROUP BY posts.id, likes."byUserId"
				) "likesFromUser"
			ON "likesFromUser".id = posts.id
		GROUP BY
			posts.id,
			users.username,
			"userImage",
			"likesTotal".count,
			"likesFromUser".count,
			owner
		ORDER BY posts.id DESC
		LIMIT 20;`,
		[user]
	);

	await GetLikedBy({ posts: result.rows, user });

	return result;
}

async function SearchPost(id) {
	return db.query(`SELECT * FROM posts WHERE id = $1;`, [id]);
}

async function DeletePostLikes(id) {
	return db.query(`DELETE FROM likes WHERE "postId" = $1;`, [id]);
}

async function DeletePost(id) {
	await DeletePostLikes(id);

	return db.query(`DELETE FROM posts WHERE id = $1;`, [id]);
}

async function EditPost({ id, description }) {
	return db.query(`UPDATE posts SET description = $1 WHERE id = $2;`, [
		description,
		id,
	]);
}

export { CreatePost, ListPosts, SearchPost, DeletePost, EditPost };
