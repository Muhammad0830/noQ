import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPaginationParams } from "../utils/pagination.js";
import { adminOnly } from "../middlewares/admin.middleware.js";

const shopRouter = Router();

shopRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      categoryId = "",
      open = "true",
      search = "",
    } = req.query as {
      categoryId?: string;
      open?: string;
      search?: string;
    };
    const { limit, cursor } = getPaginationParams(req);

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (open === "true") {
      where.isOpen = true;
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    const shops = await prisma.shop.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),

      where,

      include: {
        category: true,
        _count: {
          select: {
            services: true,
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor = null;

    if (shops.length > limit) {
      const nextItem = shops.pop();
      nextCursor = nextItem?.id;
    }

    res.status(200).json({
      data: shops,
      nextCursor,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.get("/:id", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        category: true,
        services: true,
        shopSchedules: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.get("/:id/services", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const services = await prisma.service.findMany({
      where: {
        shopId: id,
      },
      include: {
        shop: true,
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.get("/:id/reviews", authMiddleware, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { limit, cursor } = getPaginationParams(req);

    const reviews = await prisma.review.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),

      where: {
        shopId: id,
      },

      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
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

// GET /shops/:id/day-timeline?date=2026-01-20
shopRouter.get("/:id/day-timeline", async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const shop = await prisma.shop.findUnique({
    where: { id },
    include: { shopSchedules: true },
  });

  if (!shop) return res.status(404).json({ message: "Shop not found" });

  const day = new Date(date as string).getDay();

  const schedule = shop.shopSchedules.find((s) => s.dayOfWeek === day);

  if (!schedule) {
    return res.json({ open: null, close: null, busy: [] });
  }

  const startDay = new Date(`${date}T00:00:00`);
  const endDay = new Date(`${date}T23:59:59`);

  const bookings = await prisma.booking.findMany({
    where: {
      shopId: id,
      startTime: { gte: startDay, lte: endDay },
      status: { notIn: ["CANCELLED", "NO_SHOW"] },
    },
  });

  const blocks = await prisma.shopBlock.findMany({
    where: {
      shopId: id,
      startTime: { gte: startDay, lte: endDay },
    },
  });

  const busy = [
    ...bookings.map((b) => ({
      start: b.startTime,
      end: b.endTime,
    })),
    ...blocks.map((b) => ({
      start: b.startTime,
      end: b.endTime,
    })),
  ];

  res.json({
    open: schedule.openTime,
    close: schedule.closeTime,
    busy,
  });
});

shopRouter.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { name, address, phone, categoryId, description } = req.body;

    const shop = await prisma.shop.create({
      data: {
        name,
        address,
        phone,
        description,
        categoryId,
        ownerId: req.user.id,
      },
    });

    // upgrade user to ADMIN
    await prisma.user.update({
      where: { id: req.user.id },
      data: { role: "ADMIN" },
    });

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.post(
  "/:id/schedule",
  authMiddleware,
  adminOnly,
  async (req: any, res) => {
    try {
      const { dayOfWeek, openTime, closeTime } = req.body;

      const schedule = await prisma.shopSchedule.create({
        data: {
          shopId: req.params.id,
          dayOfWeek,
          openTime,
          closeTime,
        },
      });

      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

shopRouter.post(
  "/:id/block",
  authMiddleware,
  adminOnly,
  async (req: any, res) => {
    try {
      const { startTime, endTime, reason } = req.body;
      const { id } = req.params;

      const shop = await prisma.shop.findUnique({
        where: { id },
        include: { shopSchedules: true },
      });

      if (!shop) return res.status(404).json({ message: "Shop not found" });

      const day = new Date(startTime).getDay();
      console.log("day", day);
      console.log("shop", shop.shopSchedules);

      const schedule = shop.shopSchedules.find((s) => s.dayOfWeek === day);

      if (!schedule) {
        return res.status(404).json({ message: "No schedule found" });
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      const conflictBooking = await prisma.booking.findFirst({
        where: {
          shopId: id,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      // check admin blocks
      const conflictBlock = await prisma.shopBlock.findFirst({
        where: {
          shopId: id,
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      if (conflictBooking || conflictBlock) {
        return res.status(409).json({
          message: "Time not available",
        });
      }

      const block = await prisma.shopBlock.create({
        data: {
          shopId: req.params.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          reason,
        },
      });

      res.status(200).json(block);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default shopRouter;
