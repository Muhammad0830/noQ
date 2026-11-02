import { shopBlockController } from "@/composition/shop-block.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createShopBlockSchema } from "@/http/validators/shop-block/CreateShopBlockSchema.js";
import { Router } from "express";

const shopBlockRouter = Router()

shopBlockRouter.get("/", shopBlockController.list);

shopBlockRouter.post(
    "/",
    validateBody(createShopBlockSchema),
    shopBlockController.create
);

export default shopBlockRouter;