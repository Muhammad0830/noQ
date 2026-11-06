import { Router } from "express";
import { serviceController } from "@/composition/service.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createServiceSchema } from "@/http/validators/service/CreateServiceSchema.js";
import { updateServiceSchema } from "@/http/validators/service/UpdateServiceSchema.js";

const serviceRouter = Router();

serviceRouter.get("/", serviceController.getByShopId);

serviceRouter.post(
  "/",
  validateBody(createServiceSchema),
  serviceController.create
)

serviceRouter.put(
  "/:id",
  validateBody(updateServiceSchema),
  serviceController.update,
);

serviceRouter.put("/:id/activate", serviceController.activate);

serviceRouter.put("/:id/deactivate", serviceController.deactivate);

serviceRouter.delete("/:id", serviceController.delete);

export default serviceRouter;
