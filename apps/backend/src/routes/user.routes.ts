import prisma from "@/db/prisma.js";
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

router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { shopId, serviceId, rating, comment } = req.body;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        shopId,
        serviceId,
        rating,
        comment,
      },
    });

    res.status(200).json(review);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
