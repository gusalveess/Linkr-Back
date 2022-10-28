import { Router } from "express";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { postSchema } from "../Schemas/postsSchema.js";
import {
	Publish,
	ListPosts,
	DeletePost,
	EditPost,
	ListPostsWithHashtag,
	Repost,
	ToggleLike,
	InsertComment,
	ListComments,
} from "../Controllers/postsController.js";

const postsRouter = Router();

postsRouter.post("/posts", schemaValidationMiddleware(postSchema), Publish);
postsRouter.post("/posts/:id/share", Repost);
postsRouter.post("/posts/:id/like", ToggleLike);
postsRouter.post("/posts/:id/comment", InsertComment);

postsRouter.get("/posts", ListPosts);
postsRouter.get("/posts/:hashtag", ListPostsWithHashtag);
postsRouter.get("/posts/:id/comment", ListComments);

postsRouter.delete("/posts/:id", DeletePost);
postsRouter.put("/posts/:id", EditPost);

export default postsRouter;
