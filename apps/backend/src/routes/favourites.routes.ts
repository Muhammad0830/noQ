import { Router } from "express";
import prisma from "../db/prisma.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const favouriteRouter = Router();

favouriteRouter.get("/shops", authMiddleware, async (req: any, res: any) => {
  try {
    const favourites = await prisma.favoriteShop.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        shop: true,
      },
    });

    res.status(200).json(favourites);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

favouriteRouter.get("/services", authMiddleware, async (req: any, res: any) => {
  try {
    const favourites = await prisma.favoriteService.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        service: true,
      },
    });

    if (favourites.length === 0) {
      return res.status(404).json({ message: "No favourites found" });
    }

    res.status(200).json(favourites);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

favouriteRouter.post("/shop", authMiddleware, async (req: any, res) => {
  try {
    const { shopId } = req.body;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const fav = await prisma.favoriteShop.create({
      data: {
        userId: req.user.id,
        shopId,
      },
    });

    res.status(200).json(fav);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

favouriteRouter.post("/service", authMiddleware, async (req: any, res) => {
  try {
    const { serviceId } = req.body;

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const fav = await prisma.favoriteService.create({
      data: {
        userId: req.user.id,
        serviceId,
      },
    });

    res.status(200).json(fav);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default favouriteRouter;
