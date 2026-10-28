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

shopRouter.get("/:id", shopController.getShopData);

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
