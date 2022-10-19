import { Router } from "express";
import { Publish } from "../Controllers/postsController.js";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { postSchema } from "../Schemas/postsSchema.js";

const postsRouter = Router();

postsRouter.post("/posts", schemaValidationMiddleware(postSchema), Publish);

export default postsRouter;
