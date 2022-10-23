import db from "../Database/database.js";

async function CreateUser(email, passwordHash, username, picture) {
	return db.query(
		`INSERT INTO users (username, email, password, picture) VALUES ($1, $2, $3, $4)`,
		[username, email, passwordHash, picture]
	);
}

async function FindUser(email, username) {
	return db.query(`SELECT * FROM users WHERE email = $1 OR username = $2;`, [email, username]);
}

async function Login(token, userId) {
	return db.query(`INSERT INTO sessions (token, "userId") VALUES ($1, $2)`, [
		token,
		userId,
	]);
}

async function FindToken(token) {
	return db.query(
		`SELECT
        *
      FROM sessions
      WHERE token = $1
        AND active = TRUE;`,
		[token]
	);
}

async function Finish(token) {
	return db.query(`UPDATE sessions SET active = FALSE WHERE token = $1;`, [
		token,
	]);
}

export { CreateUser, FindUser, Login, FindToken, Finish };
