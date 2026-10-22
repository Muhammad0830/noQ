import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { bookingController } from "@/composition/booking.js";
import { getUserBookingListQuerySchema } from "@/http/validators/booking/GetUserBookingListQuerySchema.js";
import { validateBody, validateQuery } from "@/http/middlewares/validate.middleware.js";
import { createBookingSchema } from "@/http/validators/booking/CreateBookingSchema.js";
import { getAvailableSlotsSchema } from "@/http/validators/booking/GetAvailableSlotsSchema.js";

const bookingRouter = Router();

const toMinutes = (value: string) => {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);
  return hours * 60 + minutes;
};

const toTimeString = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

bookingRouter.get("/available-slots",
  validateQuery(getAvailableSlotsSchema),
  bookingController.availableSlots)
// async (req, res) => {
//   try {
//     const { shopId, date, serviceId, staffId } = req.query as {
//       shopId?: string;
//       date?: string;
//       serviceId?: string;
//       staffId?: string;
//     };

//     if (!shopId || !date) {
//       return res.status(400).json({ message: "shopId and date are required" });
//     }

//     const dayOfWeek = new Date(date).getDay();

//     const schedules = await prisma.shopSchedule.findMany({
//       where: { shopId, dayOfWeek, type: "OPEN" },
//       orderBy: { startTime: "asc" },
//     });

//     const recurringBlocks = await prisma.shopSchedule.findMany({
//       where: { shopId, dayOfWeek, type: "BLOCK" },
//       orderBy: { startTime: "asc" },
//     });

//     if (!schedules.length) {
//       return res.status(200).json([]);
//     }

//     const service = serviceId
//       ? await prisma.service.findFirst({
//         where: {
//           id: serviceId,
//           shopId,
//           isActive: true,
//         },
//       })
//       : null;

//     if (serviceId && !service) {
//       return res.status(404).json({ message: "Service not found" });
//     }

//     const durationMin = service?.durationMin ?? 45;
//     const bufferTimeMin = service?.bufferTime ?? 0;

//     const effectiveDuration = durationMin + bufferTimeMin;

//     const startDay = new Date(`${date}T00:00:00`);
//     const endDay = new Date(`${date}T23:59:59`);

//     const bookings = await prisma.booking.findMany({
//       where: {
//         shopId,
//         ...(staffId ? { staffId } : {}),
//         startTime: { gte: startDay, lte: endDay },
//         status: { notIn: ["CANCELLED", "NO_SHOW"] },
//       },
//       select: { startTime: true, endTime: true },
//     });

//     const blocks = await prisma.shopBlock.findMany({
//       where: {
//         shopId,
//         startTime: { gte: startDay, lte: endDay },
//       },
//       select: { startTime: true, endTime: true },
//     });

//     const busyRanges = [
//       ...bookings.map((b) => ({
//         startTime: b.startTime,
//         endTime: new Date(b.endTime.getTime() + bufferTimeMin * 60 * 1000),
//       })),
//       ...recurringBlocks.map((b) => ({
//         startTime: new Date(`${date}T${b.startTime}:00`),
//         endTime: new Date(`${date}T${b.endTime}:00`),
//       })),
//       ...blocks,
//     ];

//     const slots: {
//       id: string;
//       time: string;
//       available: boolean;
//       duration: number;
//       bufferTime: number;
//     }[] = [];

//     schedules.forEach((schedule) => {
//       let cursor = toMinutes(schedule.startTime);
//       const close = toMinutes(schedule.endTime);

//       while (cursor + effectiveDuration <= close) {
//         const startTime = toTimeString(cursor);
//         const endTime = toTimeString(cursor + effectiveDuration);

//         const slotStart = new Date(`${date}T${startTime}:00`);
//         const slotEnd = new Date(`${date}T${endTime}:00`);

//         const hasConflict = busyRanges.some(
//           (busy) => busy.startTime < slotEnd && busy.endTime > slotStart,
//         );

//         slots.push({
//           id: `${shopId}-${date}-${startTime}`,
//           time: startTime,
//           duration: durationMin,
//           bufferTime: bufferTimeMin,
//           available: !hasConflict,
//         });

//         cursor += effectiveDuration;
//       }
//     });

//     return res.status(200).json(slots);
//   } catch (error) {
//     console.error("Error fetching available slots:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

bookingRouter.get(
  "/users",
  authMiddleware,
  validateQuery(getUserBookingListQuerySchema),
  bookingController.listForUsers
);

bookingRouter.put(
  "/:bookingId/cancel",
  authMiddleware,
  bookingController.cancel
);

bookingRouter.post(
  "/",
  authMiddleware,
  validateBody(createBookingSchema),
  bookingController.create
);

export default bookingRouter;
