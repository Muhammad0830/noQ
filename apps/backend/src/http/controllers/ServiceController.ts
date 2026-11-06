import { RequestHandler } from "express";
import { GetTrendingServiceListUseCaseInterface } from
    "@/application/service/interfaces/GetTrendingServiceListUseCaseInterface.js";
import { GetServiceDetailsUseCaseInterface } from "@/application/service/interfaces/GetServiceDetailsUseCaseInterface.js";
import { GetServiceReviewListUseCaseInterface } from "@/application/service/interfaces/GetServiceReviewListUseCaseInterface.js";
import { GetShopServiceListUseCaseInterface } from "@/application/service/interfaces/GetShopServiceListUseCaseInterface.js";
import { CreateServiceUseCaseInterface } from "@/application/service/interfaces/CreateServiceUseCaseInterface.js";
import { CreateServiceSchema } from "../validators/service/CreateServiceSchema.js";
import { UpdateServiceUseCaseInterface } from "@/application/service/interfaces/UpdateServiceUseCaseInterface.js";
import { UpdateServiceSchema } from "../validators/service/UpdateServiceSchema.js";
import { ActivateServiceUseCaseInterface } from "@/application/service/interfaces/ActivateServiceUseCaseInterface.js";
import { DeactivateServiceUseCaseInterface } from "@/application/service/interfaces/DeactivateServiceUseCaseInterface.js";
import { DeleteServiceUseCaseInterface } from "@/application/service/interfaces/DeleteServiceUseCaseInterface.js";
import { validateShopContext } from "../utils/ValidateShopContext.js";

export class ServiceController {
    constructor(
        private readonly getTrendingServiceListUseCase: GetTrendingServiceListUseCaseInterface,
        private readonly getServiceDetailsUseCase: GetServiceDetailsUseCaseInterface,
        private readonly getServiceReviewListUseCase: GetServiceReviewListUseCaseInterface,
        private readonly getShopServiceListUseCase: GetShopServiceListUseCaseInterface,
        private readonly createServiceUseCase: CreateServiceUseCaseInterface,
        private readonly updateServiceUseCase: UpdateServiceUseCaseInterface,
        private readonly activateServiceUseCase: ActivateServiceUseCaseInterface,
        private readonly deactivateServiceUseCase: DeactivateServiceUseCaseInterface,
        private readonly deleteServiceUseCase: DeleteServiceUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const shopContext = validateShopContext(req);

            const {
                shopId,
                name,
                description,
                price,
                durationMin,
                bufferTime,
            } = req.body as CreateServiceSchema;

            if (shopContext.shopId !== shopId) {
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

    update: RequestHandler = async (req, res, next) => {
        try {
            const {
                id,
                name,
                description,
                price,
                durationMin,
                bufferTime,
            } = req.body as UpdateServiceSchema;

            await this.updateServiceUseCase.execute({
                id: id,
                name: name,
                description: description ?? null,
                price: price,
                durationMin: durationMin,
                bufferTime: bufferTime ?? null,
            });

            res.status(201).json({
                success: true,
                message: "Service Updated successfully",
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
            const shopContext = validateShopContext(req);

            const serviceList = await this.getShopServiceListUseCase.execute(shopContext.shopId);

            res.status(200).json(serviceList);
        } catch (error) {
            next(error);
        }
    }

    activate: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string }

            await this.activateServiceUseCase.execute(id);

            res.status(201).json({
                success: true,
                message: "Service activated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    deactivate: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            await this.deactivateServiceUseCase.execute(id);

            res.status(201).json({
                success: true,
                message: "Service deactivated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    delete: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            await this.deleteServiceUseCase.execute(id);

            res.status(201).json({
                success: true,
                message: "Service deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}