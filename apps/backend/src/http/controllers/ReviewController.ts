import { GetAllReviewsUseCaseInterface } from "@/application/review/interfaces/GetAllReviewsUseCaseInterface.js";
import { GetReviewListByShopIdUseCaseInterface } from "@/application/review/interfaces/GetReviewListByShopIdUseCaseInterface.js";
import { RequestHandler, Response } from "express";
import { toReviewListResource } from "../resources/review/GetReviewListResource.js";
import { FindReviewByIdUseCaseInterface } from "@/application/review/interfaces/FindReviewByIdUseCaseInterface.js";
import { CreateReviewUseCaseInterface } from "@/application/review/interfaces/CreateReviewUseCaseInterface.js";
import { CreateReviewSchema } from "../validators/review/CreateReviewSchema.js";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";
import { RequestWithUser } from "@/types.js";

export class ReviewController {
    constructor(
        private readonly getAllReviewsUseCase: GetAllReviewsUseCaseInterface,
        private readonly getReviewsByShopIdUseCase: GetReviewListByShopIdUseCaseInterface,
        private readonly findReviewByIdUseCase: FindReviewByIdUseCaseInterface,
        private readonly createReviewUseCase: CreateReviewUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const body = req.body as CreateReviewSchema;

            const reviewId = await this.createReviewUseCase.execute({
                userId: user.id,
                shopId: body.shopId,
                serviceId: body.serviceId,
                rating: body.rating,
                comment: body.comment,
            });

            res.status(201).json({
                succes: true,
                message: "Review created successfully",
                data: {
                    id: reviewId.toString(),
                }
            })
        } catch (error) {
            next(error);
        }
    }

    getAll: RequestHandler = async (req, res, next) => {
        try {
            const reviewList = await this.getAllReviewsUseCase.execute();

            res.status(200).json(toReviewListResource(reviewList));
        } catch (error) {
            next(error);
        }
    }

    findById: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            const review = await this.findReviewByIdUseCase.execute(id);

            res.status(200).json(review);
        } catch (error) {
            next(error);
        }
    }

    getListByShopId: RequestHandler = async (req, res, next) => {
        try {
            const { shopId } = res.locals.validatedQuery;

            const output = await this.getReviewsByShopIdUseCase.execute(shopId);

            res.status(200).json(output);
        } catch (error) {
            next(error);
        }
    }
}