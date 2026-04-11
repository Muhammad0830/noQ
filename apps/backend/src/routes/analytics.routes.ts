import prisma from "@/db/prisma.js";
import { shopValidateMiddleware } from "@/middlewares/shopValidate.middleware.js";
import { Router } from "express";

const analyticsRouter = Router();

function formatLocalDate(date: Date, type: string) {
  if (type === "year") {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-01`;
  } else {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }
}

function fillMissingDates(data: any[], type: string, startDate: Date) {
  const map = new Map(
    data.map((d) => [formatLocalDate(new Date(d.date), type), d.revenue]),
  );

  const result = [];
  const current = new Date(startDate);
  const now = new Date();

  while (current <= now) {
    const key = formatLocalDate(current, type);

    result.push({
      date: key,
      revenue: map.get(key) || 0,
    });

    if (type === "year") {
      current.setMonth(current.getMonth() + 1);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }

  return result;
}

function getDateRange(type: "week" | "month" | "year" | "all") {
  const now = new Date();
  const startDate = new Date();

  switch (type) {
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;

    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;

    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;

    case "all":
      startDate.setFullYear(2026);
      break;
  }

  return { startDate, now };
}

analyticsRouter.get("/", async (req: any, res) => {
  try {
    const { type = "week" } = req.query as {
      type: "week" | "month" | "year" | "all";
    };

    if (type === "all") {
      const [bookings, reviews] = await Promise.all([
        prisma.booking.findMany({
          where: {
            shopId: req.shop.id,
            status: "COMPLETED",
          },
          select: {
            service: { select: { price: true } },
          },
        }),

        prisma.review.aggregate({
          where: { shopId: req.shop.id },
          _avg: { rating: true },
          _count: { id: true },
        }),
      ]);

      const currentRevenue = bookings.reduce(
        (acc, b) => acc + Number(b.service.price),
        0,
      );

      return res.status(200).json({
        currentRevenue,
        currentBookingsCount: bookings.length,
        currentAverageRating: reviews._avg.rating || 0,
      });
    }

    const { startDate, now } = getDateRange(type);

    const prevStartDate = new Date(startDate);

    switch (type) {
      case "week":
        prevStartDate.setDate(prevStartDate.getDate() - 7);
        break;
      case "month":
        prevStartDate.setMonth(prevStartDate.getMonth() - 1);
        break;
      case "year":
        prevStartDate.setFullYear(prevStartDate.getFullYear() - 1);
        break;
    }

    const [bookings, prevBookings] = await Promise.all([
      prisma.booking.findMany({
        where: {
          shopId: req.shop.id,
          status: "COMPLETED",
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
        select: {
          service: { select: { price: true } },
        },
      }),

      prisma.booking.findMany({
        where: {
          shopId: req.shop.id,
          status: "COMPLETED",
          createdAt: {
            gte: prevStartDate,
            lte: startDate,
          },
        },
        select: {
          service: { select: { price: true } },
        },
      }),
    ]);

    const currentRevenue = bookings.reduce(
      (acc, b) => acc + Number(b.service.price),
      0,
    );

    const prevRevenue = prevBookings.reduce(
      (acc, b) => acc + Number(b.service.price),
      0,
    );

    const revenueChange =
      prevRevenue === 0
        ? currentRevenue > 0
          ? 100
          : 0
        : ((currentRevenue - prevRevenue) / prevRevenue) * 100;

    const [reviews, prevReviews] = await Promise.all([
      prisma.review.aggregate({
        where: {
          shopId: req.shop.id,
          createdAt: { gte: startDate, lte: now },
        },
        _avg: { rating: true },
        _count: { id: true },
      }),

      prisma.review.aggregate({
        where: {
          shopId: req.shop.id,
          createdAt: { gte: prevStartDate, lte: startDate },
        },
        _avg: { rating: true },
        _count: { id: true },
      }),
    ]);

    const bookingsNumberChange =
      prevBookings.length === 0
        ? bookings.length > 0
          ? 100
          : 0
        : ((bookings.length - prevBookings.length) / prevBookings.length) * 100;

    const averageRatingChange =
      (reviews._avg.rating ?? 0) - (prevReviews._avg.rating ?? 0);

    return res.status(200).json({
      currentRevenue,
      prevRevenue,
      revenueChange,
      currentBookingsCount: bookings.length,
      prevBookingsCount: prevBookings.length,
      bookingsNumberChange,
      currentAverageRating: reviews._avg.rating || 0,
      prevAverageRating: prevReviews._avg.rating || 0,
      averageRatingChange,
    });
  } catch (error) {
    console.error("Error fetching shop analytics:", error);
    res.status(500).json({ error: "Failed to fetch shop analytics" });
  }
});

analyticsRouter.get("/diagram_info", async (req: any, res) => {
  try {
    const { type = "week" } = req.query as {
      type: "week" | "month" | "year" | "all";
    };

    let startDate = new Date();
    let groupBy: "day" | "month" = "day";

    switch (type) {
      case "week":
        startDate.setDate(startDate.getDate() - 6);
        groupBy = "day";
        break;

      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        groupBy = "day";
        break;

      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        groupBy = "month";
        break;

      case "all":
        const createdYear = req.shop.createdAt.getFullYear();
        startDate.setFullYear(createdYear);
        groupBy = "month";
        break;
    }

    const result: any[] = await prisma.$queryRawUnsafe(`
      SELECT 
        date_trunc('${groupBy}', b."createdAt") as bucket,
        SUM(s.price)::float as revenue
      FROM "Booking" b
      JOIN "Service" s ON b."serviceId" = s.id
      WHERE 
        b."shopId" = '${req.shop.id}'
        AND b."status" = 'COMPLETED'
        AND b."createdAt" >= '${startDate.toISOString()}'
      GROUP BY bucket
      ORDER BY bucket ASC;
    `);

    return res.json({
      type,
      data: fillMissingDates(
        result.map((r) => ({
          date: r.bucket,
          revenue: r.revenue || 0,
        })),
        type,
        startDate,
      ),
    });
  } catch (error) {
    console.error("Error fetching diagram info:", error);
    res.status(500).json({ error: "Failed to fetch diagram info" });
  }
});

analyticsRouter.get("/famousServices", async (req: any, res) => {
  try {
    const { type = "all" } = req.query as {
      type: "week" | "month" | "year" | "all";
    };

    const { startDate, now } = getDateRange(type);

    const services = await prisma.service.findMany({
      where: { shopId: req.shop.id },
      include: {
        reviews: {
          where: {
            createdAt: {
              gte: startDate,
              lte: now,
            },
          },
          select: { rating: true },
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
            bookings: {
              where: {
                status: "COMPLETED",
                createdAt: {
                  gte: startDate,
                  lte: now,
                },
              },
            },
          },
        },
      },
    });

    const result = services
      .map((service) => {
        const bookingCount = service._count.bookings;

        const avg =
          service.reviews.length > 0
            ? service.reviews.reduce((a, b) => a + b.rating, 0) /
              service.reviews.length
            : 0;

        const { reviews, shop, description, _count, ...rest } = service;

        return {
          ...rest,
          shopName: shop.name,
          booking_count: bookingCount,
          averageRating: parseFloat(avg.toFixed(1)),
        };
      })
      .sort((a, b) => b.booking_count - a.booking_count);

    return res.status(200).json({
      type,
      data: result,
    });
  } catch (error) {
    console.error("Error fetching famous services:", error);
    res.status(500).json({ error: "Failed to fetch famous services" });
  }
});

analyticsRouter.get("/peak-hours", async (req: any, res) => {
  try {
    const { type = "week" } = req.query as {
      type: "week" | "month" | "year" | "all";
    };

    const now = new Date();

    const startTime = new Date();
    switch (type) {
      case "week":
        startTime.setDate(now.getDate() - 7);
        break;
      case "month":
        startTime.setMonth(now.getMonth() - 1);
        break;
      case "year":
        startTime.setFullYear(now.getFullYear() - 1);
        break;
      case "all":
        startTime.setFullYear(2000);
        break;

      default:
        break;
    }
    startTime.setDate(now.getDate() - 7);

    const bookings = await prisma.booking.findMany({
      where: {
        shopId: req.shop.id,
        status: "COMPLETED",
        startTime: {
          gte: startTime,
          lte: now,
        },
      },
      select: {
        startTime: true,
      },
    });

    const hoursMap: Record<string, number> = {};

    for (let i = 0; i < 24; i++) {
      const key = `${i.toString().padStart(2, "0")}:00`;
      hoursMap[key] = 0;
    }

    bookings.forEach((booking) => {
      const date = new Date(booking.startTime);
      const hour = date.getHours();

      const key = `${hour.toString().padStart(2, "0")}:00`;
      hoursMap[key] = (hoursMap[key] ?? 0) + 1;
    });

    return res.status(200).json(hoursMap);
  } catch (error) {
    console.error("Error fetching peak hours:", error);
    res.status(500).json({ error: "Failed to fetch peak hours" });
  }
});

export default analyticsRouter;
