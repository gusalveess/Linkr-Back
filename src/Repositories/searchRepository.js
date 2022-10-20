import db from "../Database/database.js";

async function searchUser({id}){
    const userSelected = await db.query(`
    SELECT * FROM posts
    WHERE "userId" = $1
    `,[id])

    return userSelected
}