import { Router } from "express";
import { ListHashtags } from "../Controllers/hashtagsController.js";

const hashtagsRouter = Router();

hashtagsRouter.get("/hashtags", ListHashtags);

export default hashtagsRouter;
