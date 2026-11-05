import { Router } from "express";
import prisma from "@/db/prisma.js";
import { serviceController } from "@/composition/service.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createServiceSchema } from "@/http/validators/service/CreateServiceSchema.js";
import { updateServiceSchema } from "@/http/validators/service/UpdateServiceSchema.js";
const serviceRouter = Router();

serviceRouter.get("/", serviceController.getByShopId);

serviceRouter.post(
  "/",
  validateBody(createServiceSchema),
  serviceController.create
)

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

serviceRouter.put(
  "/:id",
  validateBody(updateServiceSchema),
  serviceController.update,
);

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
