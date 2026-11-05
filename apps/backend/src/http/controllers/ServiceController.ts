import { RequestHandler } from "express";
import { GetTrendingServiceListUseCaseInterface } from
    "@/application/service/interfaces/GetTrendingServiceListUseCaseInterface.js";
import { GetServiceDetailsUseCaseInterface } from "@/application/service/interfaces/GetServiceDetailsUseCaseInterface.js";
import { GetServiceReviewListUseCaseInterface } from "@/application/service/interfaces/GetServiceReviewListUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { GetShopServiceListUseCaseInterface } from "@/application/service/interfaces/GetShopServiceListUseCaseInterface.js";
import { CreateServiceUseCaseInterface } from "@/application/service/interfaces/CreateServiceUseCaseInterface.js";
import { CreateServiceSchema } from "../validators/service/CreateServiceSchema.js";

export class ServiceController {
    constructor(
        private readonly getTrendingServiceListUseCase: GetTrendingServiceListUseCaseInterface,
        private readonly getServiceDetailsUseCase: GetServiceDetailsUseCaseInterface,
        private readonly getServiceReviewListUseCase: GetServiceReviewListUseCaseInterface,
        private readonly getShopServiceListUseCase: GetShopServiceListUseCaseInterface,
        private readonly createServiceUseCase: CreateServiceUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const shopIdMiddleware = (req as RequestWithShop).shop.id;
            const {
                shopId,
                name,
                description,
                price,
                durationMin,
                bufferTime,
            } = req.body as CreateServiceSchema;

            if (shopIdMiddleware !== shopId) {
                throw new Error("Forbidden");
            }

            await this.createServiceUseCase.execute({
                shopId: shopId,
                name: name,
                price: price,
                durationMin: durationMin,
                bufferTime: bufferTime ?? null,
                description: description ?? null,
            });

            res.status(201).json({
                success: true,
                message: "Service created Successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    trending: RequestHandler = async (req, res, next) => {
        try {
            const output = await this.getTrendingServiceListUseCase.execute();

            res.status(200).json(output.serviceList);
        } catch (error) {
            next(error)
        }
    }

    details: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            const service = await this.getServiceDetailsUseCase.execute(id);

            res.status(200).json(service);
        } catch (error) {
            next(error);
        }
    }

    reviewList: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            const output = await this.getServiceReviewListUseCase.execute(id);

            res.status(200).json(output);
        } catch (error) {
            next(error);
        }
    }

    getByShopId: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const serviceList = await this.getShopServiceListUseCase.execute(shopId);

            res.status(200).json(serviceList);
        } catch (error) {
            next(error);
        }
    }
}