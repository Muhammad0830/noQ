import { userController } from "@/composition/user.js";
import { validateQuery } from "@/http/middlewares/validate.middleware.js";
import { getBySearchSchema } from "@/http/validators/user/GetBySearchSchema.js";
import { Router } from "express";

const userRouter = Router();

userRouter.get(
    "/",
    validateQuery(getBySearchSchema),
    userController.getBySearch
)

export default userRouter;