import { Router } from "express";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { updateShopScheduleSchema } from "@/http/validators/shop-schedule/UpdateShopScheduleSchema.js";
import { shopScheduleController } from "@/composition/shop-schedule.js";

const scheduleRouter = Router();

scheduleRouter.get("/", shopScheduleController.getWeekly);

scheduleRouter.post(
  "/",
  validateBody(updateShopScheduleSchema),
  shopScheduleController.update
);

export default scheduleRouter;
