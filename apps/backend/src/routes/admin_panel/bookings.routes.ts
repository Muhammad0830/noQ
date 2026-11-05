import { bookingController } from "@/composition/booking.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { cancelBookingSchema } from "@/http/validators/booking/CancelBookingSchema.js";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.put(
  "/:id/cancel",
  validateBody(cancelBookingSchema),
  bookingController.cancelByAdmin,
);

bookingRouter.put("/:id/complete", bookingController.complete);

bookingRouter.put("/:id/confirm", bookingController.confirm);

export default bookingRouter;
