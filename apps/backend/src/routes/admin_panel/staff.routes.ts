import { Router } from "express";
import { staffController } from "@/composition/staff.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createStaffSchema } from "@/http/validators/staff/CreateStaffSchema.js";

const staffRouter = Router();

staffRouter.get("/", staffController.getList);

staffRouter.post(
  "/",
  validateBody(createStaffSchema),
  staffController.create
);

staffRouter.delete("/:id", staffController.delete);

export default staffRouter;
