import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { adminOnly } from "@/http/middlewares/admin.middleware.js";
import { shopCategoryController } from "@/composition/shop-category.js";
const categoryRouter = Router();

categoryRouter.get("/", shopCategoryController.all)

categoryRouter.post(
  "/",
  authMiddleware,
  adminOnly,
  async (req: any, res: any) => {
    const { name, icon } = req.body;

    const category = await prisma.shopCategory.create({
      data: { name, icon },
    });

    res.status(200).json(category);
  },
);

export default categoryRouter;
