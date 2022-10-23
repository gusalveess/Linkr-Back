import db from "../Database/database.js";

async function GetHashtag(tag) {
	return db.query(`SELECT id FROM hashtags WHERE name = $1;`, [tag]);
}

async function CreateHashtag(tag) {
	await db.query(`INSERT INTO hashtags (name) VALUES ($1);`, [tag]);

	return GetHashtag(tag);
}

async function CreatePostHashtags({ tags, postId }) {
	for (const tag of tags) {
		let hashtagId = (await GetHashtag(tag)).rows[0]?.id;

		if (hashtagId) {
			await db.query(
				`INSERT INTO
					"postHashtags"
				("hashtagId", "postId")
				VALUES ($1, $2);`,
				[hashtagId, postId]
			);
		} else {
			hashtagId = (await CreateHashtag(tag)).rows[0].id;

			await db.query(
				`INSERT INTO
					"postHashtags"
				("hashtagId", "postId")
				VALUES ($1, $2);`,
				[hashtagId, postId]
			);
		}
	}
}

async function CreatePost({ user, url, description, tags }) {
	const result = await db.query(
		`INSERT INTO posts ("userId", url, description) VALUES ($1, $2, $3);`,
		[user, url, description]
	);

	const postId = (
		await db.query(
			`SELECT id FROM posts WHERE "userId" = $1 ORDER BY id DESC;`,
			[user]
		)
	).rows[0].id;

	await CreatePostHashtags({ tags, postId });

	return result;
}

async function SearchPost(id) {
	return db.query(`SELECT * FROM posts WHERE id = $1;`, [id]);
}

async function DeletePostLikes(id) {
	return db.query(`DELETE FROM likes WHERE "postId" = $1;`, [id]);
}

async function DeletePostHashtags(postId) {
	return db.query(`DELETE FROM "postHashtags" WHERE "postId" = $1;`, [postId]);
}

async function DeletePost(id) {
	await DeletePostLikes(id);
	await DeletePostHashtags(id);

	return db.query(`DELETE FROM posts WHERE id = $1;`, [id]);
}

async function EditPost({ tags, id, description }) {
	await DeletePostHashtags(id);
	await CreatePostHashtags({ tags, postId: id });

	return db.query(`UPDATE posts SET description = $1 WHERE id = $2;`, [
		description,
		id,
	]);
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
			posts.id, posts.url, posts.description, posts."userId",
			users.username AS from,
			users.picture AS "userImage",
			users.id AS owner,
			users.id AS "userId",
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

async function ListPostsWithHashtag({ user, hashtag }) {
	const result = await db.query(
		`SELECT 
			posts.id, posts.url, posts.description,
			users.username AS from,
			users.picture AS "userImage",
			users.id AS owner,
			users.id AS "userId",
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
		LEFT JOIN "postHashtags"
			ON posts.id = "postHashtags"."postId"
		LEFT JOIN hashtags
			ON hashtags.id = "postHashtags"."hashtagId"
		WHERE hashtags.name = $2
		GROUP BY
			posts.id,
			users.username,
			"userImage",
			"likesTotal".count,
			"likesFromUser".count,
			owner
		ORDER BY posts.id DESC;`,
		[user, hashtag]
	);

	await GetLikedBy({ posts: result.rows, user });

	return result;
}

export {
	CreatePost,
	ListPosts,
	SearchPost,
	DeletePost,
	EditPost,
	ListPostsWithHashtag,
};
