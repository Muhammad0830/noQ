import { Router } from "express";
import prisma from "@/db/prisma.js";
import { getPaginationParams } from "@/utils/pagination.js";
import { serviceController } from "@/composition/service.js";

const serviceRouter = Router();

serviceRouter.get("/:id", serviceController.details);

serviceRouter.get("/trending/7days", serviceController.trending);

serviceRouter.get("/:id/reviews", async (req: any, res: any) => {
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
});

export default serviceRouter;
