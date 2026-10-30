import { Router } from "express";
import { serviceController } from "@/composition/service.js";

const serviceRouter = Router();

serviceRouter.get("/:id", serviceController.details);

serviceRouter.get("/trending/7days", serviceController.trending);

serviceRouter.get("/:id/reviews", serviceController.reviewList);

export default serviceRouter;
