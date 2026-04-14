import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getPaginationParams } from "../../utils/pagination.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const serviceRouter = Router();

serviceRouter.get("/", async (req: any, res: any) => {
  try {
    const { shopId } = req.query;

    const services = await prisma.service.findMany({
      where: {
        shopId,
      },
      include: {
        shop: true,
      },
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

serviceRouter.get("/:id", async (req: any, res: any) => {
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

serviceRouter.get("/trending/7days", async (req: any, res) => {
  try {
    const { search = "" } = req.query as { search?: string };
    const now = new Date();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const services = await prisma.service.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                {
                  shop: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        shop: {
          select: {
            id: true,
            name: true,
            category: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            bookings: {
              where: {
                status: "COMPLETED",
                createdAt: {
                  gte: sevenDaysAgo,
                  lte: now,
                },
              },
            },
          },
        },
      },
      take: 10,
    });

    if (services.length === 0) {
      return res.status(404).json({ error: "No services found for this shop" });
    }

    const result = services
      .map((service) => {
        const bookingCount = service._count.bookings;

        const total = service.reviews.reduce((acc, rev) => acc + rev.rating, 0);

        const avg =
          service.reviews.length > 0 ? total / service.reviews.length : 0;

        const { reviews, ...rest } = service;

        return {
          ...rest,
          booking_count: bookingCount,
          averageRating: parseFloat(avg.toFixed(1)),
        };
      })
      .sort((a, b) => b.booking_count - a.booking_count);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching famous services:", error);
    res.status(500).json({ error: "Failed to fetch famous services" });
  }
});

export default serviceRouter;
