import db from "../Database/database.js";

async function ListHashtags() {
	return db.query(
		`SELECT
			hashtags.name,
			COUNT("postHashtags"."hashtagId") AS "usedCount"
		FROM hashtags
		LEFT JOIN "postHashtags"
			ON hashtags.id = "postHashtags"."hashtagId"
		GROUP BY hashtags.name
		ORDER BY "usedCount" DESC
		LIMIT 10;`
	);
}

export { ListHashtags };
