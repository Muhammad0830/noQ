import { GetDashboardStatisticsUseCaseInterface } from "@/application/dashboard/interfaces/GetDashboardStatisticsUseCaseInterface.js";
import { RequestHandler } from "express";
import { validateShopContext } from "../utils/ValidateShopContext.js";

export class DashboardController {
    constructor(
        private readonly getDashboardStatisticsUseCase: GetDashboardStatisticsUseCaseInterface,
    ) { }

    getStatistics: RequestHandler = async (req, res, next) => {
        try {
            const shopContext = validateShopContext(req);

            const statisticsData = await this.getDashboardStatisticsUseCase.execute(shopContext.shopId);

            res.status(200).json(statisticsData);
        } catch (error) {
            next(error);
        }
    }
}