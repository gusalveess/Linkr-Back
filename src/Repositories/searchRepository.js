import db from "../Database/database.js";

async function search(id){

   return db.query(`
    SELECT users.username, posts.url,posts.description FROM users
    JOIN posts ON users.id = posts."userId"
    WHERE users.id = $1
    `,[id])

   
} 

const searchUser ={
    search
}

export {searchUser}