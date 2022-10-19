import { Router } from "express";
import { SignUp, SignIn, Logout } from "../Controllers/authControllers.js";
import { schemaValidationMiddleware } from "../Middlewares/schemaMiddleware.js";
import { signUpSchema, signInSchema } from "../Schemas/authSchema.js";

const authRouter = Router();

authRouter.post("/signUp", schemaValidationMiddleware(signUpSchema), SignUp);
authRouter.post("/signIn", schemaValidationMiddleware(signInSchema), SignIn)
authRouter.post("/logOut", Logout)

export default authRouter;
