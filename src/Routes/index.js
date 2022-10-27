import { Router } from "express";
import authRouter from "./authRoute.js";
import postsRouter from "./postsRoute.js";
import searchRouter from "./searchRoute.js";
import hashtagsRouter from "./hashtagsRoute.js";
import usersRouter from "./usersRoute.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(searchRouter);
router.use(hashtagsRouter);
router.use(usersRouter);

export default router;
