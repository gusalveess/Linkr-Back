import { Router } from "express";
import authRouter from "./authRoute.js";
import postsRouter from "./postsRoute.js";
import searchRouter from "./searchRoute.js"

const router = Router();

router.use(authRouter);
router.use(postsRouter);
router.use(searchRouter)

export default router;
