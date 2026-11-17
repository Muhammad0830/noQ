import { Router } from "express";
import { dashboardController } from "@/composition/dashboard.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getDashboardBookingListSchema } from "@/http/validators/dashboard/GetDashboardBookingListSchema.js";

const dashboardRouter = Router();

dashboardRouter.get("/base_info", dashboardController.getStatistics);

dashboardRouter.get(
    "/bookings",
    validateQuery(getDashboardBookingListSchema),
    dashboardController.bookingList
);

export default dashboardRouter;
