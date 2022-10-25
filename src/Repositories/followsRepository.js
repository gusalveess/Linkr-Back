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

export { FollowedsByUser };
