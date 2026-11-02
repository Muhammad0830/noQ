import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { adminOnly } from "@/http/middlewares/admin.middleware.js";
import { validateBody, validateShop } from "@/http/middlewares/validate.middleware.js";
import { updateShopScheduleSchema } from "@/http/validators/shop-schedule/UpdateShopScheduleSchema.js";
import { shopScheduleController } from "@/composition/shop-schedule.js";

const scheduleRouter = Router();

scheduleRouter.get(
  "/",
  authMiddleware,
  adminOnly,
  validateShop,
  shopScheduleController.getWeekly
);

scheduleRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  validateShop,
  validateBody(updateShopScheduleSchema),
  shopScheduleController.update
);

scheduleRouter.post(
  "/block",
  authMiddleware,
  adminOnly,
  validateShop,
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
