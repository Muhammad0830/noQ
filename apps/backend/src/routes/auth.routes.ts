import express from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { authController } from "@/composition/auth.js";
import { validateBody, validateQuery } from "@/http/middlewares/validate.middleware.js";
import { checkEmailExistsSchema } from "@/http/validators/auth/CheckEmailExistsSchema.js";
import { signUpSchema } from "@/http/validators/auth/SignUpSchema.js";
import { signInSchema } from "@/http/validators/auth/SignInSchema.js";

const router = express.Router();

router.get(
  "/check-email",
  validateQuery(checkEmailExistsSchema),
  authController.checkEmail
);

router.get(
  "/me",
  authMiddleware,
  authController.getUser
);

router.post(
  "/signup",
  validateBody(signUpSchema),
  authController.signUp
);

router.post(
  "/signin",
  validateBody(signInSchema),
  authController.signin
);

export default router;
