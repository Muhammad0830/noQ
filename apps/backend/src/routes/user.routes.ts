import prisma from "../db/prisma.js";
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

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
