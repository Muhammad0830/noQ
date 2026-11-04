import { GetDashboardStatisticsUseCaseInterface } from "@/application/dashboard/interfaces/GetDashboardStatisticsUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";

export class DashboardController {
    constructor(
        private readonly getDashboardStatisticsUseCase: GetDashboardStatisticsUseCaseInterface,
    ) { }

    getStatistics: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const statisticsData = await this.getDashboardStatisticsUseCase.execute(shopId);

            res.status(200).json(statisticsData);
        } catch (error) {
            next(error);
        }
    }
}