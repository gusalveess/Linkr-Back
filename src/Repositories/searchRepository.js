import db from "../Database/database.js";

async function search(id) {
	return db.query(
		`SELECT users.username AS from, users.picture AS "userImage", posts.url,posts.description FROM users
        JOIN posts ON users.id = posts."userId"
        WHERE users.id = $1;`,
		[id]
	);
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
		post.followedByUser = !!post.followedByUser;
		post.likedBy = likedBy;
		post.owner = post.owner === user;
		post.repostedByUser = post.repostedByUser === user;
	}
}

async function PostsFromUser({ id, page, user }) {
	const result = await db.query(
		`SELECT 
			posts.id, posts.url, posts.description, posts."userId",
			users.username AS from,
			users.picture AS "userImage",
			users.id AS owner,
			"likesTotal".count AS "likesTotal",
			"likesFromUser".count AS "likedByUser",
			"comments".count AS "comments",
			"shareds".count AS "shareds",
			"shareds"."repostedBy",
			"shareds"."byUserId" AS "repostedByUser",
			"followedByUser".count AS "followedByUser"
		FROM users
		LEFT JOIN posts
			ON posts."userId" = $1
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
		LEFT JOIN follows
			ON follows."followerId" = $1
		LEFT JOIN
				(SELECT 
					COUNT("comments".id),
				 	posts.id
				FROM posts
				LEFT JOIN "comments"
					ON "comments"."postId" = posts.id
				 GROUP BY posts.id
				) "comments"
			ON "comments".id = posts.id
		LEFT JOIN
				(SELECT 
					COUNT("shareds".id),
				 	posts.id,
				 	users.username AS "repostedBy",
				 	users.id AS "byUserId" 
				FROM posts
				LEFT JOIN "shareds"
					ON "shareds"."postId" = posts.id
				 LEFT JOIN users
				 	ON shareds."byUserId" = users.id
				 GROUP BY posts.id, users.username, users.id
				) "shareds"
			ON "shareds".id = posts.id
		LEFT JOIN
				(SELECT 
					COUNT(id),
					"followerId",
					"followedId"
				FROM follows
				WHERE "followerId" = $3
					AND "followedId" = $1
				GROUP BY id
				) "followedByUser"
			ON "followedByUser"."followedId" = $1
		WHERE users.id = $1
		GROUP BY
			posts.id,
			users.username,
			"userImage",
			"likesTotal".count,
			"likesFromUser".count,
			"comments",
			"shareds",
			"shareds"."repostedBy",
			"repostedByUser",
			"followedByUser",
			owner
		ORDER BY posts.id DESC
		OFFSET $2
		LIMIT 10;`,
		[id, page, user]
	);

	await GetLikedBy({ posts: result.rows, user });

	return result;
}

export { PostsFromUser, search };
