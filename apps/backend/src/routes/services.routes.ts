import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPaginationParams } from "../utils/pagination.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const serviceRouter = Router();

serviceRouter.get("/:id", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        shop: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

serviceRouter.get(
  "/:id/reviews",
  authMiddleware,
  async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { cursor, limit } = getPaginationParams(req);

      const reviews = await prisma.review.findMany({
        take: limit + 1,
        skip: cursor ? 1 : 0,
        ...(cursor && { cursor: { id: cursor } }),

        where: {
          serviceId: id,
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
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor = null;

      if (reviews.length > limit) {
        const nextItem = reviews.pop();
        nextCursor = nextItem?.id;
      }

      res.json({
        data: reviews,
        nextCursor,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

serviceRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  async (req: any, res: any) => {
    try {
      const { shopId, name, price, durationMin } = req.body;

      const shop = await prisma.shop.findUnique({
        where: { id: shopId },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      const service = await prisma.service.create({
        data: {
          shopId,
          name,
          price,
          durationMin,
        },
      });

      res.status(200).json(service);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default serviceRouter;
