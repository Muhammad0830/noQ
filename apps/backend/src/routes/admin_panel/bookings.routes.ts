import { bookingController } from "@/composition/booking.js";
import { validateBody, validateQuery } from "@/http/middlewares/validate.middleware.js";
import { cancelBookingSchema } from "@/http/validators/booking/CancelBookingSchema.js";
import { getShopHistoryBookingListSchema } from "@/http/validators/booking/GetShopHistoryBookingListSchema.js";
import { Router } from "express";

const bookingRouter = Router();

bookingRouter.put(
  "/:id/cancel",
  validateBody(cancelBookingSchema),
  bookingController.cancelByAdmin,
);

bookingRouter.put("/:id/complete", bookingController.complete);

bookingRouter.put("/:id/confirm", bookingController.confirm);

bookingRouter.put("/:id/start", bookingController.start);

bookingRouter.get(
  "/",
  validateQuery(getShopHistoryBookingListSchema),
  bookingController.getShopHistory
)

export default bookingRouter;
