import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { adminOnly } from "@/middlewares/admin.middleware.js";
import { shopValidateMiddleware } from "@/middlewares/shopValidate.middleware.js";
import { schedulePostValidate } from "../validateFunctions/bookingScheduleValidate.js";

const scheduleRouter = Router();

scheduleRouter.get(
  "/",
  authMiddleware,
  adminOnly,
  shopValidateMiddleware,
  async (req: any, res) => {
    try {
      const { date } = req.query as { date?: string };

      if (!date) {
        return res.status(400).json({ message: "date is required" });
      }
      if (date === "all") {
        const week = {
          "0": "Sunday",
          "1": "Monday",
          "2": "Tuesday",
          "3": "Wednesday",
          "4": "Thursday",
          "5": "Friday",
          "6": "Saturday",
        };
        const weeklySchedule = await prisma.shopSchedule.findMany({
          where: {
            shopId: req.shop.id,
            type: "OPEN",
          },
        });

        const schedule = {} as any;

        for (const day of Object.entries(week) as any[]) {
          const dayOfWeekSchedule = weeklySchedule.filter(
            (s) => String(s.dayOfWeek) == day[0],
          );

          if (dayOfWeekSchedule) {
            const blocks = [];
            const opens = [];
            for (const block of dayOfWeekSchedule) {
              if (block.type == "OPEN") {
                opens.push(block);
              } else {
                blocks.push(block);
              }
            }

            schedule[day[1]] = { opens, blocks };
          }
        }

        res.status(200).json({ schedule });
      } else {
        const startOfDay = new Date(`${date}T00:00:00`);
        const endOfDay = new Date(`${date}T23:59:59`);

        // ✅ fetch bookings with full relations
        const bookings = await prisma.booking.findMany({
          where: {
            shopId: req.shop.id,
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                phoneNumber: true,
              },
            },
            service: {
              select: {
                id: true,
                name: true,
                price: true,
                durationMin: true,
              },
            },
            shop: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            staff: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            startTime: "asc",
          },
        });

        // ✅ also include one-time blocks (important for admin view)
        const blocks = await prisma.shopBlock.findMany({
          where: {
            shopId: req.shop.id,
            startTime: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          orderBy: {
            startTime: "asc",
          },
        });

        // ✅ recurring blocks (from schedule)
        const dayOfWeek = new Date(date).getDay();

        const recurringBlocks = await prisma.shopSchedule.findMany({
          where: {
            shopId: req.shop.id,
            dayOfWeek,
            type: "BLOCK",
          },
        });

        const recurringBlocksFormatted = recurringBlocks.map((b) => ({
          id: b.id,
          startTime: new Date(`${date}T${b.startTime}:00`),
          endTime: new Date(`${date}T${b.endTime}:00`),
          type: "RECURRING_BLOCK",
        }));

        return res.status(200).json({
          date,
          bookings,
          blocks,
          recurringBlocks: recurringBlocksFormatted,
        });
      }
    } catch (error) {
      console.error("Schedule fetch error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

scheduleRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  shopValidateMiddleware,
  async (req: any, res) => {
    try {
      const { schedule } = req.body;

      if (!Array.isArray(schedule) || schedule.length !== 7) {
        return res.status(400).json({ message: "Schedule must have 7 days" });
      }

      const shop = await prisma.shop.findUnique({
        where: { id: req.shop.id },
      });

      if (!shop) {
        return res.status(404).json({ message: "Shop not found" });
      }

      // 🔥 validate schedule
      const { status, json } = schedulePostValidate(schedule) ?? {};

      if (status && json) {
        return res.status(status).json(json);
      }

      // 🔥 remove old schedule
      await prisma.shopSchedule.deleteMany({
        where: { shopId: req.shop.id },
      });

      // ✅ transform data
      const data = schedule.flatMap((day: any) =>
        day.slots.map((slot: any) => ({
          shopId: req.shop.id,
          dayOfWeek: day.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          type: slot.block ? "BLOCK" : "OPEN", // 🔥 KEY PART
        })),
      );

      // 🔥 insert new schedule
      await prisma.shopSchedule.createMany({
        data,
      });

      return res.status(200).json({ message: "Schedule saved successfully" });
    } catch (error) {
      console.error("Schedule error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

scheduleRouter.post(
  "/block",
  authMiddleware,
  adminOnly,
  shopValidateMiddleware,
  async (req: any, res: any) => {
    try {
      const { startTime, endTime, reason } = req.body;

      const shop = await prisma.shop.findUnique({
        where: { id: req.shop.id },
        include: { shopSchedules: true },
      });

      if (!shop) return res.status(404).json({ message: "Shop not found" });

      const day = new Date(startTime).getDay();

      const schedule = shop.shopSchedules.find((s) => s.dayOfWeek === day);

      if (!schedule) {
        return res.status(404).json({ message: "No schedule found" });
      }

      const start = new Date(startTime);
      const end = new Date(endTime);

      const conflictBooking = await prisma.booking.findFirst({
        where: {
          shopId: req.shop.id,
          status: { notIn: ["CANCELLED", "NO_SHOW"] },
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      // check admin blocks
      const conflictBlock = await prisma.shopBlock.findFirst({
        where: {
          shopId: req.shop.id,
          startTime: { lt: end },
          endTime: { gt: start },
        },
      });

      if (conflictBooking || conflictBlock) {
        return res.status(409).json({
          message: "Time not available",
        });
      }

      const block = await prisma.shopBlock.create({
        data: {
          shopId: req.shop.id,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          reason,
        },
      });

      res.status(200).json(block);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default scheduleRouter;
