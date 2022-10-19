import { Router } from "express";
import { SignUp, SignIn, Logout } from "../Controllers/authControllers.js";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { signUpSchema, signInSchema } from "../Schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/signup", schemaValidationMiddleware(signUpSchema), SignUp);
authRouter.post("/signin", schemaValidationMiddleware(signInSchema), SignIn);
authRouter.post("/logout", Logout);

export default authRouter;
