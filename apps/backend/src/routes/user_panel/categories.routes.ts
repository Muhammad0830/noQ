import { Router } from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { adminOnly } from "@/http/middlewares/admin.middleware.js";
import { shopCategoryController } from "@/composition/shop-category.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createShopCategorySchema } from "@/http/validators/shop-category/CreateShopCategorySchema.js";
const categoryRouter = Router();

categoryRouter.get("/", shopCategoryController.all)

categoryRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  validateBody(createShopCategorySchema),
  shopCategoryController.create
);

export default categoryRouter;
