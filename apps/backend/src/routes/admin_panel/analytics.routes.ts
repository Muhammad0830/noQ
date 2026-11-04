import { analyticsController } from "@/composition/analytics.js";
import prisma from "@/db/prisma.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getRevenueBaseInfoSchema } from "@/http/validators/analytics/GetRevenueBaseInfoSchema.js";
import { getRevenueDiagramInfoSchema } from "@/http/validators/analytics/GetRevenueDiagramInfoSchema.js";
import { Router } from "express";

const analyticsRouter = Router();

function fillMissingDates(
  data: { date: Date; revenue: number }[],
  type: "week" | "month" | "year" | "all",
  startDate: Date,
) {
  const normalize = (date: Date) => {
    const d = new Date(date);

    if (type === "year") {
      return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
    }

    if (type === "all") {
      return new Date(d.getFullYear(), 0, 1).toISOString();
    }

    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  const map = new Map(
    data.map((d) => [normalize(new Date(d.date)), d.revenue]),
  );

  const result = [];
  const current = new Date(startDate);
  const now = new Date();

  while (current <= now) {
    let bucketDate: Date;

    if (type === "year") {
      bucketDate = new Date(current.getFullYear(), current.getMonth(), 1);
      current.setMonth(current.getMonth() + 1);
    } else if (type === "all") {
      bucketDate = new Date(current.getFullYear(), 0, 1);
      current.setFullYear(current.getFullYear() + 1);
    } else {
      bucketDate = new Date(current);
      bucketDate.setHours(0, 0, 0, 0);
      current.setDate(current.getDate() + 1);
    }

    const key = bucketDate.toISOString();

    result.push({
      date: key,
      revenue: map.get(key) ?? 0,
    });
  }

  return result;
}

function getDateRange(type: "week" | "month" | "year" | "all") {
  const now = new Date();
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  switch (type) {
    case "week":
      startDate.setDate(now.getDate() - 6);
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

analyticsRouter.get(
  "/",
  validateQuery(getRevenueBaseInfoSchema),
  analyticsController.getRevenueBaseInfo
);

analyticsRouter.get(
  "/diagram_info",
  validateQuery(getRevenueDiagramInfoSchema),
  analyticsController.getRevenueDiagramInfo
)

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
                startTime: {
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
