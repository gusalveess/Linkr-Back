import db from "../Database/database.js";

async function FollowedsByUser(user) {
	const followeds = (
		await db.query(
			`SELECT 
				COUNT(id) AS "followeds"
			FROM follows
			WHERE "followerId" = $1;`,
			[user]
		)
	).rows[0]?.followeds;

	return followeds;
}

async function Unfollow({ userId, user }) {
	return db.query(
		`DELETE FROM follows WHERE "followerId" = $1 AND "followedId" = $2;`,
		[user, userId]
	);
}

async function InsertFollow({ userId, user }) {
	return db.query(
		`INSERT INTO follows ("followerId", "followedId") VALUES ($1, $2);`,
		[user, userId]
	);
}

async function Follow({ userId, user }) {
	const isFollower = (
		await db.query(
			`SELECT * FROM follows WHERE "followerId" = $1 AND "followedId" = $2;`,
			[user, userId]
		)
	).rows[0];

	if (isFollower) {
		return Unfollow({ userId, user });
	}

	return InsertFollow({ userId, user });
}

export { Follow, Unfollow, InsertFollow, FollowedsByUser };
