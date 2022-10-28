import express from "express";
import { validateSessionByToken } from "../Middlewares/validateTokenMiddleware.js";
import {
	searchPeople,
	listPostsFromUser,
} from "../Controllers/searchController.js";

const router = express.Router();

router.get("/users", validateSessionByToken, searchPeople);
router.get("/user/:id/posts", validateSessionByToken, listPostsFromUser);

export default router;
