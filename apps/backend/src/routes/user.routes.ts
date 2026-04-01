import prisma from "../db/prisma.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { uploadImage } from "../utils/handleImage.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        reviews: true,
      },
    });

    res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put(
  "/profile",
  authMiddleware,
  upload.single("file"),
  async (req: any, res) => {
    try {
      const { name, phoneNumber } = req.body;
      const file = req.file;
      const userId = req.user.id;

      let uploadedFilePath: string | null = null;

      if (file && file.originalname) {
        uploadedFilePath = await uploadImage(file, "user_avatars");
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (uploadedFilePath !== null) updateData.avatarUrl = uploadedFilePath;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "Failed to update profile" });
    }
  },
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
