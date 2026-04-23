import type { StatusProps } from "../../../../../shared/types/bookings.js";
import prisma from "../../db/prisma.js";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.put("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body as { status: StatusProps };

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        shop: true,
        service: true,
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await prisma.booking.update({
      where: { id },
      data: {
        status: status,
      },
    });

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookingRouter;
