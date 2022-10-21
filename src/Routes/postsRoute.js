import { Router } from "express";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { postSchema } from "../Schemas/postsSchema.js";
import {
	Publish,
	ListPosts,
	DeletePost,
} from "../Controllers/postsController.js";

const postsRouter = Router();

postsRouter.post("/posts", schemaValidationMiddleware(postSchema), Publish);
postsRouter.get("/posts", ListPosts);
postsRouter.delete("/posts/:id", DeletePost);

export default postsRouter;
