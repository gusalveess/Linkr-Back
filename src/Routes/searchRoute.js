import express from "express";
import { validateSessionByToken } from "../Middlewares/validateTokenMiddleware.js";
import {
	searchId,
	listPostsFromUser,
} from "../Controllers/searchController.js";

const router = express.Router();

router.get("/user/:id", validateSessionByToken, searchId);
router.get("/user/:id/posts", validateSessionByToken, listPostsFromUser);

export default router;
