import { Router } from "express";
import prisma from "../../db/prisma.js";
import { upload } from "../../middlewares/upload.js";
import { uploadImage } from "../../utils/handleImage.js";

const shopRouter = Router();

shopRouter.put(
  "/:shopId",
  upload.single("file"),
  async (req: any, res: any) => {
    try {
      const { shopId } = req.params;

      const shop = await prisma.shop.findUnique({
        where: { id: shopId },
      });

      if (!shop) {
        return res.status(404).json({ error: "Shop not found" });
      }

      if (shop.id !== req.shop.id) {
        return res
          .status(403)
          .json({ error: "You don't have access to this shop" });
      }

      const { name, address, phone, description } = req.body;
      const file = req.file;

      let uploadedFilePath: string | null = null;

      if (!name || !address || !phone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      if (file && file.originalname) {
        uploadedFilePath = await uploadImage(file, "shop_images");
      }

      const updateData: any = {};
      updateData.name = name;
      updateData.address = address;
      updateData.phone = phone;
      if (description !== null) updateData.description = description;
      if (uploadedFilePath !== null)
        updateData.backgroundImageUrl = uploadedFilePath;

      await prisma.shop.update({
        where: { id: shopId },
        data: updateData,
      });

      res.status(200).json({ message: "Shop updated successfully" });
    } catch (error) {
      console.error("Error updating shop", error);
      res.status(500).json({ message: "Failed to update shop" });
    }
  },
);

export default shopRouter;
