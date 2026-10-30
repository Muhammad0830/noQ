import { Router } from "express";
import prisma from "@/db/prisma.js";
import { authMiddleware } from "@/http/middlewares/auth.middleware.js";
import { reviewController } from "@/composition/review.js";
import { validateBody } from "@/http/middlewares/validate.middleware.js";
import { createReviewSchema } from "@/http/validators/review/CreateReviewSchema.js";

const reviewRouter = Router();

reviewRouter.get("/", reviewController.getAll);

reviewRouter.get("/:id", reviewController.findById);

reviewRouter.post(
  "/",
  authMiddleware,
  validateBody(createReviewSchema),
  reviewController.create
);

export default reviewRouter;
