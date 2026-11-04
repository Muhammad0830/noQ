import { GetRevenueBaseInfoUseCaseInterface } from "@/application/analytics/interfaces/GetRevenueBaseInfoUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { GetRevenueBaseInfoSchema } from "../validators/analytics/GetRevenueBaseInfoSchema.js";
import { GetRevenueDiagramInfoUseCaseInterface } from "@/application/analytics/interfaces/GetRevenueDiagramInfoUseCaseInterface.js";
import { GetRevenueDiagramInfoSchema } from "../validators/analytics/GetRevenueDiagramInfoSchema.js";

export class AnalyticsController {
    constructor(
        private readonly getRevenueBaseInfoUseCase: GetRevenueBaseInfoUseCaseInterface,
        private readonly getRevenueDiagramInfoUseCase: GetRevenueDiagramInfoUseCaseInterface,
    ) { }

    getRevenueBaseInfo: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;
            const { startTime, endTime } = res.locals.validatedQuery as GetRevenueBaseInfoSchema;

            const revenueBaseInfo = await this.getRevenueBaseInfoUseCase.execute({
                shopId: shopId,
                startTime: startTime,
                endTime: endTime,
            });

            res.status(200).json(revenueBaseInfo);
        } catch (error) {
            next(error);
        }
    }

    getRevenueDiagramInfo: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;
            const query = res.locals.validatedQuery as GetRevenueDiagramInfoSchema;

            const revenueDiagramInfo = await this.getRevenueDiagramInfoUseCase.execute({
                ...query,
                shopId: shopId,
            })

            res.status(200).json(revenueDiagramInfo);
        } catch (error) {
            next(error);
        }
    }
}