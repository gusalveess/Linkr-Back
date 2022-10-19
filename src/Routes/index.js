import { Router } from "express";
import authRouter from "./authRoute.js";
import postsRouter from "./postsRoute.js";

const router = Router();

router.use(authRouter);
router.use(postsRouter);

export default router;
