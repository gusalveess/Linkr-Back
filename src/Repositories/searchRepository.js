import db from "../Database/database.js";

async function search(id){

   return db.query(`
    SELECT users.username AS from, users.picture AS "userImage", posts.url,posts.description FROM users
    JOIN posts ON users.id = posts."userId"
    WHERE users.id = $1
    `,[id])

   
} 

const searchUser ={
    search
}

export {searchUser}