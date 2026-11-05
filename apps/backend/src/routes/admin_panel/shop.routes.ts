import { Router } from "express";
import { upload } from "@/http/middlewares/upload.js";
import { shopController } from "@/composition/shop.js";

const shopRouter = Router();

shopRouter.put(
  "/:shopId",
  upload.single("file"),
  shopController.update
);

export default shopRouter;
