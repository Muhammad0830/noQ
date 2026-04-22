import { Router } from "express";
import prisma from "../../db/prisma.js";
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
    const { name, price, durationMin, bufferTime = null } = req.body;

    const service = await prisma.service.create({
      data: {
        shopId: req.shop.id,
        name,
        price,
        durationMin,
        bufferTime,
      },
    });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

serviceRouter.post("/isActive/toggle", async (req: any, res: any) => {
  try {
    const { id } = req.body;

    const service = await prisma.service.findFirst({
      where: {
        id,
        shopId: req.shop.id,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updated = await prisma.service.update({
      where: {
        id,
      },
      data: {
        isActive: !service.isActive,
      },
    });

    res.status(200).json({
      message: "Service isActive toggled successfully",
      service: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default serviceRouter;
