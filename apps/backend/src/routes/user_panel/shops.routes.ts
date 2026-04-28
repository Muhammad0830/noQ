import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { getPaginationParams } from "../../utils/pagination.js";
import { upload } from "../../middlewares/upload.js";
import { supabaseServer } from "../../services/supabaseServer.js";
import { uploadImage } from "../../utils/handleImage.js";

const shopRouter = Router();

shopRouter.get("/", async (req, res) => {
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
        include: {
          category: true,
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
          isActive: true,
          shop: {
            isOpen: true,
          },
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
        include: {
          category: true,
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
            isActive: true,
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
      include: {
        category: true,
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
          staffs: {
            select: {
              user: true
            }
          }
        },
      }),
      prisma.service.findMany({
        where: {
          shopId: id,
          isActive: true,
        },
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
        isActive: true,
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
shopRouter.get("/:id/day-timeline", async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date is required" });
    }

    const day = new Date(date as string).getDay();

    const schedules = await prisma.$queryRaw<
      {
        id: string;
        shopId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
      }[]
    >`
      SELECT "id", "shopId", "dayOfWeek", "startTime", "endTime"
      FROM "ShopSchedule"
      WHERE "shopId" = ${id} AND "dayOfWeek" = ${day}
      ORDER BY "startTime" ASC
    `;

    if (!schedules.length) {
      return res.json({ open: null, close: null, disabled: [], busy: [] });
    }

    const startDay = new Date(`${date}T00:00:00`);
    const endDay = new Date(`${date}T23:59:59`);

    const bookings = await prisma.booking.findMany({
      where: {
        shopId: id,
        startTime: { lt: endDay },
        endTime: { gt: startDay },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    });

    const blocks = await prisma.shopBlock.findMany({
      where: {
        shopId: id,
        startTime: { lt: endDay },
        endTime: { gt: startDay },
      },
    });

    const busy = [
      ...bookings.map((b) => ({
        start: b.startTime.toISOString(),
        end: b.endTime.toISOString(),
      })),
      ...blocks.map((b) => ({
        start: b.startTime.toISOString(),
        end: b.endTime.toISOString(),
      })),
    ];

    const open = schedules[0]?.startTime ?? null;
    const close = schedules[schedules.length - 1]?.endTime ?? null;

    const disabled: { start: string; end: string }[] = [];

    for (let i = 0; i < schedules.length - 1; i++) {
      const gapStart = schedules[i]?.endTime ?? "";
      const gapEnd = schedules[i + 1]?.startTime ?? "";

      disabled.push({
        start: new Date(`${date}T${gapStart}:00`).toISOString(),
        end: new Date(`${date}T${gapEnd}:00`).toISOString(),
      });
    }

    return res.json({ open, close, disabled, busy });
  } catch (error) {
    console.error("Error building day timeline:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
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
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
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

export default shopRouter;
