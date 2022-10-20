import { Router } from "express";
import { Publish, ListPosts } from "../Controllers/postsController.js";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { postSchema } from "../Schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.post("/posts", schemaValidationMiddleware(postSchema), Publish);
postsRouter.get("/posts", ListPosts);

export default postsRouter;
