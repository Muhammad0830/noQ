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
// async (req: any, res: any) => {
//   try {
//     const { shopId, serviceId, rating, comment = "" } = req.body;

//     const shop = await prisma.shop.findUnique({
//       where: { id: shopId },
//     });

//     if (!shop) {
//       return res.status(404).json({ message: "Shop not found" });
//     }

//     if (serviceId) {
//       const service = await prisma.service.findUnique({
//         where: { id: serviceId },
//       });

//       if (!service) {
//         return res.status(404).json({ message: "Service not found" });
//       }
//     }

//     if (!rating) {
//       return res.status(400).json({ message: "Rating is missing" });
//     }

//     const review = await prisma.review.create({
//       data: {
//         userId: req.user.id,
//         shopId,
//         serviceId: serviceId || null,
//         rating,
//         comment,
//       },
//     });

//     res.status(200).json(review);
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

export default reviewRouter;
