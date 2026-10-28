import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { getPaginationParams } from "@/utils/pagination.js";
import { upload } from "@/http/middlewares/upload.js";
import { supabaseServer } from "@/services/supabaseServer.js";
import { uploadImage } from "@/utils/handleImage.js";
import { addMinutes, getOneDayAfter, timeToMinutes } from "@noq/shared";
import { shopController } from "@/composition/shop.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getShopListSchema } from "@/http/validators/shop/GetShopListSchema.js";

const shopRouter = Router();

shopRouter.get(
  "/",
  validateQuery(getShopListSchema),
  shopController.list
);

shopRouter.get("/:id", shopController.getShopData)

// GET /shops/:id/day-timeline?date=2026-01-20T15:00:00Z
shopRouter.get("/:id/day-timeline", async (req, res) => {
  try {
    const { id } = req.params;
    const { date }: { date?: string } = req.query;

    if (!date) {
      return res.status(400).json({ message: "date is required" });
    }

    const day = new Date(date).getDay();

    const schedules = await prisma.shopSchedule.findMany({
      where: {
        shopId: id,
        dayOfWeek: day,
      },
      select: {
        id: true,
        shopId: true,
        dayOfWeek: true,
        startTime: true,
        endTime: true,
        type: true,
      },
      orderBy: {
        startTime: "asc",
      },
    });

    if (!schedules.length) {
      return res.json({ open: null, close: null, disabled: [], busy: [] });
    }

    const startDay = new Date(date);
    const endDay = getOneDayAfter(date);

    const bookings = await prisma.booking.findMany({
      where: {
        shopId: id,
        startTime: { lt: endDay },
        endTime: { gt: startDay },
        status: { notIn: ["CANCELLED", "NO_SHOW"] },
      },
    });

    const blocks = await prisma.shopBlock.findMany({
      where: {
        shopId: id,
        startTime: { lt: endDay },
        endTime: { gt: startDay },
      },
    });

    const busy = [
      ...bookings.map((b) => ({
        start: b.startTime.toISOString(),
        end: b.endTime.toISOString(),
      })),
      ...blocks.map((b) => ({
        start: b.startTime.toISOString(),
        end: b.endTime.toISOString(),
      })),
    ];

    const open = schedules[0]?.startTime ?? null;
    const close = schedules[schedules.length - 1]?.endTime ?? null;

    const disabled: { start: string; end: string }[] = [];

    const regularBlocks = schedules.filter(s => s.type === 'BLOCK');

    for (let i = 0; i < regularBlocks.length; i++) {
      const gapStart = regularBlocks[i]?.startTime ?? "";
      const gapEnd = regularBlocks[i]?.endTime ?? "";

      disabled.push({
        start: addMinutes(date, timeToMinutes(gapStart)).toISOString(),
        end: addMinutes(date, timeToMinutes(gapEnd)).toISOString(),
      });
    }

    return res.json({ open, close, disabled, busy });
  } catch (error) {
    console.error("Error building day timeline:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

shopRouter.get("/trending/7days", shopController.getTrending);

shopRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req: any, res) => {
    const file = req.file;

    const { name, address, phone, categoryId, description } = req.body;

    let uploadedFilePath: string | null = null;

    if (file) {
      uploadedFilePath = await uploadImage(file, "shop_images");
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const shop = await tx.shop.create({
          data: {
            name,
            address,
            phone,
            description,
            categoryId,
            ownerId: req.user.id,
          },
        });

        await tx.user.update({
          where: { id: req.user.id },
          data: { role: "ADMIN" },
        });

        await tx.shop.update({
          where: { id: shop.id },
          data: { backgroundImageUrl: uploadedFilePath },
        });

        return shop;
      });

      return res.json({
        message: "Shop created successfully",
        course: result,
      });
    } catch (error: any) {
      console.error("Error:", error);

      if (uploadedFilePath) {
        await supabaseServer.storage.from("courses").remove([uploadedFilePath]);
      }

      return res.status(500).json({
        error: error.message || "Failed to create course",
      });
    }
  },
);

export default shopRouter;
