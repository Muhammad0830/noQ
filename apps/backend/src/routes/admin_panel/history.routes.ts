import { Router } from "express";
import prisma from "../../db/prisma.js";
import type { Booking } from "@shared/types/bookings.js";

const historyRouter = Router();

historyRouter.get("/", async (req: any, res: any) => {
  try {
    const { date, search } = req.query;

    const selectedDate = new Date(date);

    // build date range
    let startDate = new Date(selectedDate);
    let endDate = new Date(selectedDate);

    if (selectedDate.getDate() === new Date().getDate()) {
      endDate = new Date(); // today → until now
    } else {
      endDate.setDate(endDate.getDate() + 1); // next day
    }

    const bookings = await prisma.booking.findMany({
      where: {
        shopId: req.shop.id,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        OR: [
          {
            user: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            staff: {
              user: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      },
      include: {
        shop: true,
        service: true,
        user: true,
        staff: true,
      },
    });

    const dayBookings = await prisma.booking.findMany({
      where: {
        shopId: req.shop.id,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        service: true,
      },
    });

    const dayRevenue = dayBookings.reduce((acc, booking) => {
      if (booking.service?.price) {
        const servicePrice = Number(booking.service.price);
        return acc + servicePrice;
      }
      return acc;
    }, 0);

    return res.status(200).json({ bookings, dayRevenue });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

export default historyRouter;
