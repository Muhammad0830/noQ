import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/admin.middleware.js";
const categoryRouter = Router();

categoryRouter.get("/", authMiddleware, async (req, res) => {
  const categories = await prisma.shopCategory.findMany({
    include: {
      _count: {
        select: { shops: true },
      },
    },
  });

  res.status(200).json(categories);
});

categoryRouter.post(
  "/",
  authMiddleware,
  async (req: any, res: any) => {
    const { name, icon } = req.body;

    const category = await prisma.shopCategory.create({
      data: { name, icon },
    });

    res.status(200).json(category);
  },
);

export default categoryRouter;
