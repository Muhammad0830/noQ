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

    const message = updated.isActive
      ? `${service.name} Service activated`
      : `${service.name} Service deactivated`;

    res.status(200).json({
      message,
      service: updated,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

serviceRouter.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, price, durationMin, bufferTime = null } = req.body;

    const service = await prisma.service.findFirst({
      where: {
        id,
        shopId: req.shop.id,
      },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const nextName = typeof name === "string" ? name.trim() : "";
    const nextPrice = Number(price);
    const nextDurationMin = Number(durationMin);
    const nextBufferTime =
      bufferTime === null || bufferTime === "" ? null : Number(bufferTime);

    if (!nextName) {
      return res.status(400).json({ message: "Service name required" });
    }

    if (Number.isNaN(nextPrice) || nextPrice <= 0) {
      return res.status(400).json({ message: "Price invalid" });
    }

    if (Number.isNaN(nextDurationMin) || nextDurationMin <= 0) {
      return res.status(400).json({ message: "Duration invalid" });
    }

    if (nextBufferTime !== null && (Number.isNaN(nextBufferTime) || nextBufferTime < 0)) {
      return res.status(400).json({ message: "Buffer time invalid" });
    }

    const updatedService = await prisma.service.update({
      where: {
        id,
      },
      data: {
        name: nextName,
        price: nextPrice,
        durationMin: nextDurationMin,
        bufferTime: nextBufferTime,
      },
    });

    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

serviceRouter.delete("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findFirst({
      where: { id, shopId: req.shop.id },
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await prisma.$transaction([
      prisma.favoriteService.deleteMany({
        where: { serviceId: id },
      }),
      prisma.review.deleteMany({
        where: { serviceId: id },
      }),
      prisma.booking.deleteMany({
        where: { serviceId: id },
      }),
      prisma.service.delete({
        where: { id },
      }),
    ]);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default serviceRouter;
