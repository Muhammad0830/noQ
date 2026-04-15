import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { adminOnly } from "@/middlewares/admin.middleware.js";
import { shopValidateMiddleware } from "@/middlewares/shopValidate.middleware.js";
import { schedulePostValidate } from "../validateFunctions/bookingScheduleValidate.js";

const scheduleRouter = Router();

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
