import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import type { StatusProps } from "../../../../../shared/types/bookings.js";
import { bookingScheduleValidate } from "../validateFunctions/bookingScheduleValidate.js";

const bookingRouter = Router();

function getBookings({
  userId,
  shopId,
  status,
  futureOnly = false,
  inProgressOnly = false,
}: {
  userId?: string;
  shopId?: string;
  status: StatusProps[];
  futureOnly?: boolean;
  inProgressOnly?: boolean;
}) {
  const now = new Date();

  return prisma.booking.findMany({
    where: {
      ...(userId && { userId }),
      ...(shopId && { shopId }),
      status: {
        in: status,
      },
      ...(futureOnly && {
        startTime: {
          gt: now,
        },
      }),
      ...(inProgressOnly && {
        startTime: {
          lt: now,
        },
        endTime: {
          gt: now,
        },
      }),
    },
    include: {
      shop: true,
      service: true,
      user: true,
    },
  });
}

const toMinutes = (value: string) => {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTimeString = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

bookingRouter.get("/available-slots", async (req, res) => {
  try {
    const { shopId, date, serviceId, staffId } = req.query as {
      shopId?: string;
      date?: string;
      serviceId?: string;
      staffId?: string;
    };

    if (!shopId || !date) {
      return res.status(400).json({ message: "shopId and date are required" });
    }

    const dayOfWeek = new Date(date).getDay();

    const schedules = await prisma.shopSchedule.findMany({
      where: { shopId, dayOfWeek, type: "OPEN" },
      orderBy: { startTime: "asc" },
    });

    const recurringBlocks = await prisma.shopSchedule.findMany({
      where: { shopId, dayOfWeek, type: "BLOCK" },
      orderBy: { startTime: "asc" },
    });

    if (!schedules.length) {
      return res.status(200).json([]);
    }

    const service = serviceId
      ? await prisma.service.findFirst({
        where: {
          id: serviceId,
          shopId,
          isActive: true,
        },
      })
      : null;

    if (serviceId && !service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const durationMin = service?.durationMin ?? 45;
    const bufferTimeMin = service?.bufferTime ?? 0;

    const effectiveDuration = durationMin + bufferTimeMin;

    const startDay = new Date(`${date}T00:00:00`);
    const endDay = new Date(`${date}T23:59:59`);

    const bookings = await prisma.booking.findMany({
      where: {
        shopId,
        ...(staffId ? { staffId } : {}),
        startTime: { gte: startDay, lte: endDay },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
      select: { startTime: true, endTime: true },
    });

    const blocks = await prisma.shopBlock.findMany({
      where: {
        shopId,
        startTime: { gte: startDay, lte: endDay },
      },
      select: { startTime: true, endTime: true },
    });

    const busyRanges = [
      ...bookings.map((b) => ({
        startTime: b.startTime,
        endTime: new Date(b.endTime.getTime() + bufferTimeMin * 60 * 1000),
      })),
      ...recurringBlocks.map((b) => ({
        startTime: new Date(`${date}T${b.startTime}:00`),
        endTime: new Date(`${date}T${b.endTime}:00`),
      })),
      ...blocks,
    ];

    const slots: {
      id: string;
      time: string;
      available: boolean;
      duration: number;
      bufferTime: number;
    }[] = [];

    schedules.forEach((schedule) => {
      let cursor = toMinutes(schedule.startTime);
      const close = toMinutes(schedule.endTime);

      while (cursor + effectiveDuration <= close) {
        const startTime = toTimeString(cursor);
        const endTime = toTimeString(cursor + effectiveDuration);

        const slotStart = new Date(`${date}T${startTime}:00`);
        const slotEnd = new Date(`${date}T${endTime}:00`);

        const hasConflict = busyRanges.some(
          (busy) => busy.startTime < slotEnd && busy.endTime > slotStart,
        );

        slots.push({
          id: `${shopId}-${date}-${startTime}`,
          time: startTime,
          duration: durationMin,
          bufferTime: bufferTimeMin,
          available: !hasConflict,
        });

        cursor += effectiveDuration;
      }
    });

    return res.status(200).json(slots);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.get("/users/active", authMiddleware, async (req: any, res) => {
  try {
    const bookings = await getBookings({
      userId: req.user.id,
      status: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
      futureOnly: true,
    });

    const inProgressBookings = await getBookings({
      userId: req.user.id,
      status: ["PENDING", "CONFIRMED", "IN_PROGRESS"],
      inProgressOnly: true,
    });

    const pendingBookings = bookings.filter((b) => b.status === "PENDING");

    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");

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
        futureOnly: true,
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
      console.error("error", error);
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
    const { shopId, serviceId, startTime, staffId, userId } = req.body;

    if (!shopId || !serviceId || !startTime) {
      return res
        .status(400)
        .json({ message: "shopId, serviceId and startTime are required" });
    }

    const service = await prisma.service.findFirst({
      where: {
        id: serviceId,
        shopId,
        isActive: true,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.shopId !== shopId) {
      return res
        .status(400)
        .json({ message: "Service does not belong to selected shop" });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true },
    });

    if (!currentUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isAdmin = currentUser.role === "ADMIN";
    const effectiveUserId =
      isAdmin && typeof userId === "string" && userId.trim().length > 0
        ? userId.trim()
        : req.user.id;

    if (!isAdmin && userId && userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: effectiveUserId },
      select: { id: true },
    });

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (staffId) {
      const staff = await prisma.staff.findFirst({
        where: {
          id: staffId,
          shopId,
        },
      });

      if (!staff) {
        return res.status(404).json({ message: "Staff not found" });
      }
    }

    const start = new Date(startTime);

    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ message: "Invalid startTime" });
    }

    const end = new Date(start);
    end.setMinutes(
      end.getMinutes() + service.durationMin + (service.bufferTime ?? 0),
    );

    const validateResult: { hasError: boolean; status?: number; json?: any } =
      await bookingScheduleValidate(shopId, start, end);

    if (validateResult.hasError) {
      return res.status(validateResult.status!).json(validateResult.json);
    }

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
        userId: effectiveUserId,
        shopId,
        serviceId,
        startTime: start,
        endTime: end,
        staffId,
      },
    });

    res.status(200).json(booking);
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookingRouter;
