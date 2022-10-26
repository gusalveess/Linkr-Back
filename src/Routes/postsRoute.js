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
} from "../Controllers/postsController.js";

const postsRouter = Router();

postsRouter.post("/posts", schemaValidationMiddleware(postSchema), Publish);
postsRouter.post("/posts/:id/share", Repost);

postsRouter.get("/posts", ListPosts);
postsRouter.get("/posts/:hashtag", ListPostsWithHashtag);

postsRouter.delete("/posts/:id", DeletePost);
postsRouter.put("/posts/:id", EditPost);

export default postsRouter;
