import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const bookingRouter = Router();

bookingRouter.get("/active", authMiddleware, async (req: any, res: any) => {
  try {
    const {
      shopId = "",
      serviceId = "",
      startTime = "",
      endTime = "",
    } = req.query as {
      shopId?: string;
      serviceId?: string;
      startTime?: string;
      endTime?: string;
    };

    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
        status: {
          in: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
        },
        shopId,
        serviceId,
        startTime,
        endTime,
      },
      include: {
        shop: true,
        service: true,
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.get("/history", authMiddleware, async (req: any, res: any) => {
  try {
    const {
      shopId = "",
      serviceId = "",
      startTime = "",
      endTime = "",
    } = req.query as {
      shopId?: string;
      serviceId?: string;
      startTime?: string;
      endTime?: string;
    };

    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
        status: {
          in: ["COMPLETED", "CANCELLED", "NO_SHOW"],
        },
        shopId,
        serviceId,
        startTime,
        endTime,
      },
      include: {
        shop: true,
        service: true,
      },
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.post("/bookings", authMiddleware, async (req: any, res) => {
  try {
    const { shopId, serviceId, startTime } = req.body;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    const start = new Date(startTime);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + service!.durationMin);

    // check booking conflicts
    const conflictBooking = await prisma.booking.findFirst({
      where: {
        shopId,
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    // check admin blocks
    const conflictBlock = await prisma.shopBlock.findFirst({
      where: {
        shopId,
        startTime: { lt: end },
        endTime: { gt: start },
      },
    });

    if (conflictBooking || conflictBlock) {
      return res.status(409).json({
        message: "Time not available",
      });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        shopId,
        serviceId,
        startTime: start,
        endTime: end,
      },
    });

    res.status(200).json(booking);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookingRouter;
