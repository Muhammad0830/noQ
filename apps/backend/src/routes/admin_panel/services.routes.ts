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

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await prisma.service.update({
      where: {
        id,
      },
      data: {
        isActive: !service.isActive,
      },
    });

    res.status(200).json({ message: "Service isActive toggled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

serviceRouter.put(
  "/:serviceId",
  authMiddleware,
  adminOnly,
  shopValidateMiddleware,
  async (req: any, res) => {
    try {
      const { name, price, durationMin, bufferTime = null } = req.body;

      const { serviceId } = req.params;

      const service = await prisma.service.findUnique({
        where: {
          id: serviceId,
        },
        include: {
          shop: true,
        },
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      await prisma.service.update({
        where: {
          id: serviceId,
        },
        data: {
          name,
          price,
          durationMin,
          bufferTime,
        },
      });

      res.status(200).json({ message: "Service updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default serviceRouter;
