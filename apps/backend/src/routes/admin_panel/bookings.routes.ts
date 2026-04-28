import type { StatusProps } from "../../../../../shared/types/bookings.js";
import prisma from "../../db/prisma.js";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.put("/:id/cancel", async (req: any, res: any) => {
  try {
    const { id } = req.params;

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
        status: "CANCELLED",
      },
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    console.error("booking cancel error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

bookingRouter.put("/:id/complete", async (req: any, res: any) => {
  try {
    const { id } = req.params;

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
        status: "COMPLETED",
      },
    });

    res.status(200).json({ message: "Booking completed successfully" });
  } catch (err) {
    console.error("booking complete error", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default bookingRouter;
