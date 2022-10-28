import express from "express";
import { validateSessionByToken } from "../Middlewares/validateTokenMiddleware.js";
import {
	searchPeople,
	listPostsFromUser,
	searchInput
} from "../Controllers/searchController.js";

const router = express.Router();

router.get("/users", validateSessionByToken, searchPeople);
router.get("/user/:id/posts", validateSessionByToken, listPostsFromUser);
router.get('/search',validateSessionByToken,searchInput)

export default router;
