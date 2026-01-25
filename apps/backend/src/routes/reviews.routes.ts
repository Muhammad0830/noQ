import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPaginationParams } from "../utils/pagination.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const reviewRouter = Router();

reviewRouter.get("/", authMiddleware, adminOnly, async (req: any, res: any) => {
  try {
    const { shopId } = req.query;

    const reviews = await prisma.review.findMany({
      where: {
        shopId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        service: true,
        shop: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

reviewRouter.get("/:id", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        service: true,
        shop: true,
      },
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

reviewRouter.post("/", authMiddleware, async (req: any, res: any) => {
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

    if (!comment || !rating) {
      return res.status(400).json({ message: "Comment or Rating is missing" });
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
    res.status(500).json({ message: "Internal server error" });
  }
});

export default reviewRouter;
