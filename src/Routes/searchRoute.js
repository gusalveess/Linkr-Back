import express  from "express";
import {validateSessionByToken} from '../Middlewares/validateTokenMiddleware.js'
import {searchId} from '../Controllers/searchController.js'

const router =express.Router()

router.get('/user/:id',validateSessionByToken,searchId)

export default router