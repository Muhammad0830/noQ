import { Router } from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { upload } from "@/http/middlewares/upload.js";
import { shopController } from "@/composition/shop.js";
import { validateBody, validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getShopListSchema } from "@/http/validators/shop/GetShopListSchema.js";
import { createShopSchema } from "@/http/validators/shop/CreateShopSchema.js";

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
  validateBody(createShopSchema),
  shopController.create
);

export default shopRouter;
