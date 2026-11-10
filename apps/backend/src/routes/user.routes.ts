import express from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { upload } from "@/http/middlewares/upload.js";
import { userController } from "@/composition/user.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { updateUserSchema } from "@/http/validators/user/UpdateUserSchema.js";
import { updateUserAvatarSchema } from "@/http/validators/user/UpdateUserAvatarSchema.js";
import { fileUploadMiddleware } from "@/http/middlewares/FileUploadMiddleware.js";

const router = express.Router();

router.put(
  "/profile/details",
  authMiddleware,
  validateBody(updateUserSchema),
  userController.updateDetails
);

router.put(
  "/profile/avatar",
  authMiddleware,
  upload.single("file"),
  fileUploadMiddleware({ type: "image" }),
  validateBody(updateUserAvatarSchema),
  userController.updateAvatar
);

export default router;
