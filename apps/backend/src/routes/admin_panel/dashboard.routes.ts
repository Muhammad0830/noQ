import { Router } from "express";
import { dashboardController } from "@/composition/dashboard.js";

const dashboardRouter = Router();

dashboardRouter.get("/base_info", dashboardController.getStatistics);

export default dashboardRouter;
