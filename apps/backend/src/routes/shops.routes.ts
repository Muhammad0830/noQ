import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getPaginationParams } from "../utils/pagination.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
import { upload } from "../middlewares/upload.js";
import { v4 as uuidv4 } from "uuid";
import { supabaseServer } from "../services/supabaseServer.js";
import { uploadImage } from "../utils/handleImage.js";

const shopRouter = Router();

shopRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const {
      categoryId = "",
      open = "true",
      search = "",
      minPrice,
      maxPrice,
    } = req.query as any;
    const { shopCursor, serviceCursor, limit = 10 } = getPaginationParams(req);

    if (search && (categoryId || minPrice || maxPrice)) {
      return res.status(400).json({
        message: "Cannot combine search with filters",
      });
    }

    if (search) {
      const shops = await prisma.shop.findMany({
        take: Number(limit) + 1,
        skip: shopCursor ? 1 : 0,
        ...(shopCursor && { cursor: { id: shopCursor } }),
        where: {
          isOpen: true,
          name: { contains: search, mode: "insensitive" },
        },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor = null;
      if (shops.length > limit) {
        const next = shops.pop();
        nextCursor = next?.id;
      }

      return res.json({
        type: "search",
        shops,
        nextShopCursor: nextCursor,
      });
    }

    if (!categoryId && (minPrice || maxPrice)) {
      const services = await prisma.service.findMany({
        take: Number(limit) + 1,
        skip: serviceCursor ? 1 : 0,
        ...(serviceCursor && { cursor: { id: serviceCursor } }),
        where: {
          isOpen: true,
          price: {
            ...(minPrice && { gte: Number(minPrice) }),
            ...(maxPrice && { lte: Number(maxPrice) }),
          },
        },
        orderBy: { id: "desc" },
      });

      let nextCursor = null;
      if (services.length > limit) {
        const next = services.pop();
        nextCursor = next?.id;
      }

      return res.json({
        type: "price-only",
        services,
        nextServiceCursor: nextCursor,
      });
    }

    if (categoryId) {
      const shops = await prisma.shop.findMany({
        take: Number(limit) + 1,
        skip: shopCursor ? 1 : 0,
        ...(shopCursor && { cursor: { id: shopCursor } }),
        where: {
          isOpen: true,
          categoryId,
          ...(open === "true" && { isOpen: true }),
        },
        orderBy: { createdAt: "desc" },
      });

      let nextShopCursor = null;
      if (shops.length > limit) {
        const next = shops.pop();
        nextShopCursor = next?.id;
      }

      let services: any[] = [];

      if (minPrice || maxPrice) {
        services = await prisma.service.findMany({
          where: {
            shop: { categoryId },
            price: {
              ...(minPrice && { gte: Number(minPrice) }),
              ...(maxPrice && { lte: Number(maxPrice) }),
            },
          },
          include: {
            shop: true,
          },
        });
      }

      return res.json({
        type: "filter",
        shops,
        services,
        nextShopCursor,
      });
    }

    const shops = await prisma.shop.findMany({
      take: Number(limit) + 1,
      skip: shopCursor ? 1 : 0,
      ...(shopCursor && { cursor: { id: shopCursor } }),
      where: {
        isOpen: true,
        ...(categoryId && { categoryId }),
        ...(open === "true" && { isOpen: true }),
      },
      orderBy: { createdAt: "desc" },
    });

    let nextShopCursor = null;
    if (shops.length > limit) {
      const next = shops.pop();
      nextShopCursor = next?.id;
    }

    return res.json({
      type: "no-filter",
      shops,
      nextShopCursor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const [shop, services, reviewStats] = await prisma.$transaction([
      prisma.shop.findUnique({
        where: { id },
        include: {
          category: true,
        },
      }),
      prisma.service.findMany({
        where: { shopId: id },
        include: {
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      }),
      prisma.review.aggregate({
        where: { shopId: id },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const averageRating = reviewStats._avg.rating ?? 0;

    const response = {
      ...shop,
      services,
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: reviewStats._count.id,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching shop:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

shopRouter.get("/:id/services", async (req: any, res: any) => {
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

shopRouter.get("/:id/reviews", async (req: any, res: any) => {
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
shopRouter.get("/:id/day-timeline", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  const day = new Date(date as string).getDay();

  const schedules = await prisma.shopSchedule.findMany({
    where: { shopId: id, dayOfWeek: day },
    orderBy: { startTime: "asc" },
  });

  if (!schedules || !schedules.length || schedules.length === 0) {
    return res.json({ open: null, close: null, disabled: [] });
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
    ...bookings.map((b) => ({ start: b.startTime, end: b.endTime })),
    ...blocks.map((b) => ({ start: b.startTime, end: b.endTime })),
  ];

  const open = schedules[0]?.startTime ?? null;
  const close = schedules[schedules.length - 1]?.endTime ?? null;

  const disabled: { start: string; end: string }[] = [];

  for (let i = 0; i < schedules.length - 1; i++) {
    disabled.push({
      start: schedules[i]?.endTime ?? "",
      end: schedules[i + 1]?.startTime ?? "",
    });
  }

  res.json({ open, close, disabled, busy });
});

shopRouter.get("/trending/7days", async (req, res) => {
  try {
    const { search = "", categoryId = "" } = req.query as {
      search?: string;
      categoryId?: string;
    };

    const trendingShops = await prisma.booking.groupBy({
      by: ["shopId"],
      where: {
        status: "COMPLETED",
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // last 7 days
        },
      },
      _count: {
        shopId: true,
      },
      orderBy: {
        _count: {
          shopId: "desc",
        },
      },
      take: 10,
    });

    const shopIds = trendingShops.map((t) => t.shopId);

    if (shopIds.length === 0) {
      return res.status(200).json([]);
    }

    const shops = await prisma.shop.findMany({
      where: {
        id: { in: shopIds },
        ...(categoryId ? { categoryId } : {}),
        ...(search
          ? { name: { contains: search, mode: "insensitive" } }
          : {}),
      },
      include: {
        reviews: {
          select: {
            rating: true,
          },
        },
        services: {
          select: {
            name: true,
          },
        },
        category: true,
        _count: {
          select: { services: true, reviews: true },
        },
      },
    });

    const result = shopIds
      .map((id) => {
        const shop = shops.find((s) => s.id === id);

        if (!shop) return null;

        const bookingCount =
          trendingShops.find((t) => t.shopId === id)?._count.shopId || 0;

        const total = shop.reviews.reduce(
          (acc: number, rev: { rating: number }) => acc + rev.rating,
          0,
        );

        const avg = shop.reviews.length > 0 ? total / shop.reviews.length : 0;

        const servicesArray = shop.services.map((s) => s.name);

        const { reviews, ...rest } = shop;

        return {
          ...rest,
          services: servicesArray,
          booking_count_last_week: bookingCount,
          averageRating: parseFloat(avg.toFixed(1)),
        };
      })
      .filter(Boolean);

    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req: any, res) => {
    const file = req.file;

    const { name, address, phone, categoryId, description } = req.body;

    let uploadedFilePath: string | null = null;

    if (file) {
      uploadedFilePath = await uploadImage(file, "shop_images");
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const shop = await tx.shop.create({
          data: {
            name,
            address,
            phone,
            description,
            categoryId,
            ownerId: req.user.id,
          },
        });

        await tx.user.update({
          where: { id: req.user.id },
          data: { role: "ADMIN" },
        });

        await tx.shop.update({
          where: { id: shop.id },
          data: { backgroundImageUrl: uploadedFilePath },
        });

        return shop;
      });

      return res.json({
        message: "Shop created successfully",
        course: result,
      });
    } catch (error: any) {
      console.error("Error:", error);

      if (uploadedFilePath) {
        await supabaseServer.storage.from("courses").remove([uploadedFilePath]);
      }

      return res.status(500).json({
        error: error.message || "Failed to create course",
      });
    }
  },
);

shopRouter.post(
  "/:id/schedule",
  authMiddleware,
  adminOnly,
  async (req: any, res) => {
    try {
      const { schedule } = req.body;
      const { id: shopId } = req.params;

      const shop = await prisma.shop.findUnique({
        where: { id: shopId },
      });

      // check shop exists
      if (!shop) return res.status(404).json({ message: "Shop not found" });

      // validate schedule
      for (const day of schedule) {
        if (schedule.length !== 7 || day.dayOfWeek < 0 || day.dayOfWeek > 6) {
          return res.status(400).json({ message: "Invalid day" });
        }

        for (const slot of day.slots) {
          if (slot.startTime < "00:00" || slot.startTime > "23:59") {
            return res.status(400).json({ message: "Invalid start time" });
          }
          if (slot.endTime < "00:00" || slot.endTime > "23:59") {
            return res.status(400).json({ message: "Invalid end time" });
          }
          if (slot.startTime >= slot.endTime) {
            return res.status(400).json({ message: "Invalid time range" });
          }
        }
      }

      await prisma.shopSchedule.deleteMany({
        where: { shopId },
      });

      const data = schedule.flatMap((day: any) =>
        day.slots.map((slot: any) => ({
          shopId,
          dayOfWeek: day.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      );

      await prisma.shopSchedule.createMany({
        data,
      });

      return res.status(200).json({ message: "Schedule saved" });
    } catch (error) {
      console.error(error);
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
