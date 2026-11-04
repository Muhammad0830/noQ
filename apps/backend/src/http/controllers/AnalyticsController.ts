import { GetRevenueBaseInfoUseCaseInterface } from "@/application/analytics/interfaces/GetRevenueBaseInfoUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";

export class AnalyticsController {
    constructor(
        private readonly getRevenueBaseInfoUseCase: GetRevenueBaseInfoUseCaseInterface,
    ) { }

    revenueBaseInfo: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;
            const { startTime, endTime } = res.locals.validatedQuery;

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
}