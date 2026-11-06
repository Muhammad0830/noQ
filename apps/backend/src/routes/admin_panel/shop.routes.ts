import { Router } from "express";
import { upload } from "@/http/middlewares/upload.js";
import { shopController } from "@/composition/shop.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { updateShopSchema } from "@/http/validators/shop/UpdateShopSchema.js";

const shopRouter = Router();

shopRouter.put(
  "/:shopId",
  validateBody(updateShopSchema),
  upload.single("file"),
  shopController.update
);

export default shopRouter;
