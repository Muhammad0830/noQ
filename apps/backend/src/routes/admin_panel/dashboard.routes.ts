import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminOnly } from "../../middlewares/admin.middleware.js";

const dashboardRouter = Router();

dashboardRouter.get(
  "/base_info",
  authMiddleware,
  adminOnly,
  async (req: any, res) => {
    try {
      const now = new Date();

      // current 7 days
      const currentStart = new Date();
      currentStart.setDate(now.getDate() - 6);
      currentStart.setHours(0, 0, 0, 0);

      // previous 7 days
      const prevStart = new Date();
      prevStart.setDate(now.getDate() - 13);
      prevStart.setHours(0, 0, 0, 0);

      const prevEnd = new Date();
      prevEnd.setDate(now.getDate() - 7);
      prevEnd.setHours(23, 59, 59, 999);

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6); // go back 6 days
      weekAgo.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const [sevenDayBookings, staffCount, currentCompleted, prevCompleted] =
        await Promise.all([
          prisma.booking.count({
            where: {
              shopId: req.shop.id,
              startTime: {
                gte: currentStart,
                lte: now,
              },
            },
          }),

          prisma.staff.count({
            where: { shopId: req.shop.id },
          }),

          // ✅ current 7 days
          prisma.booking.findMany({
            where: {
              shopId: req.shop.id,
              status: "COMPLETED",
              startTime: {
                gte: currentStart,
                lte: now,
              },
            },
            select: {
              service: {
                select: { price: true },
              },
            },
          }),

          // ✅ previous 7 days
          prisma.booking.findMany({
            where: {
              shopId: req.shop.id,
              status: "COMPLETED",
              startTime: {
                gte: prevStart,
                lte: prevEnd,
              },
            },
            select: {
              service: {
                select: { price: true },
              },
            },
          }),
        ]);

      // 💰 calculate revenue
      const currentRevenue = currentCompleted.reduce((acc, b) => {
        return acc + Number(b.service.price);
      }, 0);
      const prevRevenue = prevCompleted.reduce((acc, b) => {
        return acc + Number(b.service.price);
      }, 0);

      let revenueChange = 0;

      if (prevRevenue === 0) {
        revenueChange = currentRevenue > 0 ? 100 : 0;
      } else {
        revenueChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
      }

      return res.json({
        sevenDayBookings,
        staffCount,
        currentRevenue,
        prevRevenue,
        revenueChange,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default dashboardRouter;
