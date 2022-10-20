import {searchUser} from "../Repositories/searchRepository.js"

async function searchId(req,res){
    const id = req.params.id
    console.log(id)
    try{
       const result = await searchUser.search(id)
       console.log(result)
      
        if (result.rowCount === 0) {
            return res.sendStatus(404)
          }  
          res.send(result.rows)
    }catch(error){
        console.log(error)
        return res.sendStatus(500)
    }
}

export {searchId}