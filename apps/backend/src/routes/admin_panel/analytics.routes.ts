import { analyticsController } from "@/composition/analytics.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getFamousServiceListSchema } from "@/http/validators/analytics/GetFamousServiceListSchema.js";
import { getRevenueBaseInfoSchema } from "@/http/validators/analytics/GetRevenueBaseInfoSchema.js";
import { getRevenueDiagramInfoSchema } from "@/http/validators/analytics/GetRevenueDiagramInfoSchema.js";
import { Router } from "express";
import { getPeakHourListSchema } from "@/http/validators/analytics/GetPeakHourListSchema.js";

const analyticsRouter = Router();

analyticsRouter.get(
  "/",
  validateQuery(getRevenueBaseInfoSchema),
  analyticsController.getRevenueBaseInfo
);

analyticsRouter.get(
  "/diagram_info",
  validateQuery(getRevenueDiagramInfoSchema),
  analyticsController.getRevenueDiagramInfo
);

analyticsRouter.get(
  "/famousServices",
  validateQuery(getFamousServiceListSchema),
  analyticsController.getFamousServiceList
);

analyticsRouter.get(
  "/peak-hours",
  validateQuery(getPeakHourListSchema),
  analyticsController.getPeakHourList
);

export default analyticsRouter;
