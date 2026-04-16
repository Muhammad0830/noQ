import { Router } from "express";
import prisma from "../../db/prisma.js";
import type { Booking } from "@shared/types/bookings.js";

const historyRouter = Router();

const getDayRange = (rawDate?: string) => {
  const parsed = rawDate ? new Date(rawDate) : new Date();
  const safeDate = Number.isNaN(parsed.getTime()) ? new Date() : parsed;

  const startOfDay = new Date(
    safeDate.getFullYear(),
    safeDate.getMonth(),
    safeDate.getDate(),
    0,
    0,
    0,
    0,
  );
  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  return { startOfDay, endOfDay };
};

historyRouter.get("/", async (req: any, res: any) => {
  try {
    const { date } = req.query as { date?: string };
    const { startOfDay, endOfDay } = getDayRange(date);

    const bookings = await prisma.booking.findMany({
      where: {
        shopId: req.shop.id,
        startTime: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      orderBy: {
        startTime: "asc",
      },
      include: {
        shop: true,
        service: true,
        user: true,
        staff: {
          include: {
            user: true,
          },
        },
      },
    });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching admin history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default historyRouter;
