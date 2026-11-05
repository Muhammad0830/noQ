import { bookingController } from "@/composition/booking.js";
import prisma from "@/db/prisma.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { cancelBookingSchema } from "@/http/validators/booking/CancelBookingSchema.js";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.put(
  "/:id/cancel",
  validateBody(cancelBookingSchema),
  bookingController.cancelByAdmin,
)
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
