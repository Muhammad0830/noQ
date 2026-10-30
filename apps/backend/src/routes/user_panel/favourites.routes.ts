import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { favouriteController } from "@/composition/favourite.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { addShopToFavouriteSchema } from "@/http/validators/favourite/AddShopToFavouriteSchema.js";
import { addServiceToFavouriteSchema } from "@/http/validators/favourite/AddServiceToFavouriteSchema.js";

const favouriteRouter = Router();

favouriteRouter.get(
  "/shops",
  authMiddleware,
  favouriteController.getShopList
);

favouriteRouter.get(
  "/services",
  authMiddleware,
  favouriteController.getServiceList
);

favouriteRouter.post(
  "/shop",
  authMiddleware,
  validateBody(addShopToFavouriteSchema),
  favouriteController.addShopToFavourite
)

favouriteRouter.post(
  "/service",
  authMiddleware,
  validateBody(addServiceToFavouriteSchema),
  favouriteController.addServiceToFavourite
)

favouriteRouter.delete(
  "/shops/:id",
  authMiddleware,
  favouriteController.removeShopFromFavourite
);

favouriteRouter.delete(
  "/services/:id",
  authMiddleware,
  favouriteController.removeServiceFromFavourite
);

export default favouriteRouter;
