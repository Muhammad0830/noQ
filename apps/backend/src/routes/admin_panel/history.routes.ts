import { Router } from "express";
import prisma from "../../db/prisma.js";

const historyRouter = Router();

historyRouter.get("/", async (req: any, res: any) => {
  try {
    const { date } = req.query;

    const selectedDate = new Date(date);

    let bookings;

    if (selectedDate.getDate() === new Date().getDate()) {
      bookings = await prisma.booking.findMany({
        where: {
          shopId: req.shop.id,
          createdAt: {
            gte: selectedDate,
            lte: new Date(),
          },
        },
        include: {
          shop: true,
          service: true,
          user: true,
          staff: true,
        },
      });
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);

      bookings = await prisma.booking.findMany({
        where: {
          shopId: req.shop.id,
          createdAt: {
            gte: selectedDate,
            lte: newDate,
          },
        },
        include: {
          shop: true,
          service: true,
          user: true,
        },
      });
    }

    return res.status(200).json(bookings);
  } catch (error) {}
});

export default historyRouter;