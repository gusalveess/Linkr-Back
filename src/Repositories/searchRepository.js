import db from "../Database/database.js";

async function search({ id, page }) {
	return db.query(
		`SELECT users.username AS from, users.picture AS "userImage", posts.url,posts.description FROM users
        JOIN posts ON users.id = posts."userId"
        WHERE users.id = $1
        OFFSET $2
        LIMIT 10;`, // não tirar OFFSET e LIMIT
		[id, page]
	);
}

const searchUser = {
	search,
};

export { searchUser };

///klmmimoikmoi
