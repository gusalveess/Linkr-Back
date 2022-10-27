import { Router } from "express";
import { ToggleFollow } from "../Controllers/usersController.js";

const usersRouter = Router();

usersRouter.post("/users/:userId/follow", ToggleFollow);

export default usersRouter;
