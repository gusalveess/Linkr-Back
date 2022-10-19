import { Router } from "express";
import { SignUp, SignIn, Logout } from "../Controllers/authControllers.js";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { validateSessionByToken } from "../Middlewares/validateTokenMiddleware.js";
import { signUpSchema, signInSchema } from "../Schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/signup", schemaValidationMiddleware(signUpSchema), SignUp);
authRouter.post("/signin", schemaValidationMiddleware(signInSchema), SignIn);

authRouter.use(validateSessionByToken);

authRouter.post("/logout", Logout);

export default authRouter;
