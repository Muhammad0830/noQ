import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

type StatusProps =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

function getBookings({
  userId,
  shopId,
  status,
}: {
  userId?: string;
  shopId?: string;
  status: StatusProps[];
}) {
  return prisma.booking.findMany({
    where: {
      ...(userId && { userId }),
      ...(shopId && { shopId }),
      status: {
        in: status,
      },
    },
    include: {
      shop: true,
      service: true,
      user: true,
    },
  });
}

const bookingRouter = Router();

bookingRouter.get("/users/active", authMiddleware, async (req: any, res) => {
  try {
    const bookings = await getBookings({
      userId: req.user.id,
      status: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
    });

    const pendingBookings = bookings.filter((b) => b.status === "PENDING");

    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");

    const inProgressBookings = bookings.filter(
      (b) => b.status === "IN_PROGRESS",
    );

    res.status(200).json({
      pending: pendingBookings,
      confirmed: confirmedBookings,
      inProgress: inProgressBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.get("/users/history", authMiddleware, async (req: any, res) => {
  try {
    const bookings = await getBookings({
      userId: req.user.id,
      status: ["COMPLETED", "CANCELLED", "NO_SHOW"],
    });

    const cancelledBookings = bookings.filter((b) => b.status === "CANCELLED");

    const completedBookings = bookings.filter((b) => b.status === "COMPLETED");

    const nowShowBookings = bookings.filter((b) => b.status === "NO_SHOW");

    res.status(200).json({
      cancelled: cancelledBookings,
      completed: completedBookings,
      nowShow: nowShowBookings,
    });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.get(
  "/shops/:shopId/active",
  authMiddleware,
  async (req: any, res: any) => {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      const bookings = await getBookings({
        shopId,
        status: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
      });

      const pendingBookings = bookings.filter((b) => b.status === "PENDING");

      const confirmedBookings = bookings.filter(
        (b) => b.status === "CONFIRMED",
      );

      const inProgressBookings = bookings.filter(
        (b) => b.status === "IN_PROGRESS",
      );

      res.status(200).json({
        pending: pendingBookings,
        confirmed: confirmedBookings,
        inProgress: inProgressBookings,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

bookingRouter.get(
  "/shops/:shopId/history",
  authMiddleware,
  async (req: any, res: any) => {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({ message: "shopId is required" });
      }

      const bookings = await getBookings({
        shopId,
        status: ["COMPLETED", "CANCELLED", "NO_SHOW"],
      });

      const cancelledBookings = bookings.filter(
        (b) => b.status === "CANCELLED",
      );

      const completedBookings = bookings.filter(
        (b) => b.status === "COMPLETED",
      );

      const nowShowBookings = bookings.filter((b) => b.status === "NO_SHOW");

      res.status(200).json({
        cancelled: cancelledBookings,
        completed: completedBookings,
        nowShow: nowShowBookings,
      });
    } catch (error) {
      console.error("error", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

bookingRouter.post("/", authMiddleware, async (req: any, res) => {
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
