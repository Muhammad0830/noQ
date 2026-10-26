import { Router } from "express";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { bookingController } from "@/composition/booking.js";
import { getUserBookingListQuerySchema } from "@/http/validators/booking/GetUserBookingListQuerySchema.js";
import { validateBody, validateQuery } from "@/http/middlewares/validate.middleware.js";
import { createBookingSchema } from "@/http/validators/booking/CreateBookingSchema.js";
import { getAvailableSlotsSchema } from "@/http/validators/booking/GetAvailableSlotsSchema.js";

const bookingRouter = Router();

bookingRouter.get("/available-slots",
  validateQuery(getAvailableSlotsSchema),
  bookingController.availableSlots)

bookingRouter.get(
  "/users",
  authMiddleware,
  validateQuery(getUserBookingListQuerySchema),
  bookingController.listForUsers
);

bookingRouter.put(
  "/:bookingId/cancel",
  authMiddleware,
  bookingController.cancel
);

bookingRouter.post(
  "/",
  authMiddleware,
  validateBody(createBookingSchema),
  bookingController.create
);

export default bookingRouter;
