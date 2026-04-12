import { Router } from "express";
import prisma from "../../db/prisma.js";
import { authMiddleware } from "@/middlewares/auth.middleware.js";
import { adminOnly } from "@/middlewares/admin.middleware.js";
import { shopValidateMiddleware } from "@/middlewares/shopValidate.middleware.js";

const serviceRouter = Router();

serviceRouter.get("/", async (req: any, res: any) => {
  try {
    const services = await prisma.service.findMany({
      where: {
        shopId: req.shop.id,
      },
      include: {
        shop: true,
      },
    });

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error(error);
  }
});

serviceRouter.post("/", async (req: any, res: any) => {
  try {
    const { name, price, durationMin } = req.body;

    const shop = await prisma.shop.findUnique({
      where: { id: req.shop.id },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const service = await prisma.service.create({
      data: {
        shopId: req.shop.id,
        name,
        price,
        durationMin,
      },
    });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default serviceRouter;