import { GetDashboardStatisticsUseCaseInterface } from "@/application/dashboard/interfaces/GetDashboardStatisticsUseCaseInterface.js";
import { RequestHandler } from "express";
import { validateShopContext } from "../utils/ValidateShopContext.js";
import { GetDashboardBookingListSchema } from "../validators/dashboard/GetDashboardBookingListSchema.js";
import { GetBookingListByDateTimeUseCaseInterface } from "@/application/booking/interfaces/GetBookingListByDateTimeUseCaseInterface.js";

export class DashboardController {
    constructor(
        private readonly getDashboardStatisticsUseCase: GetDashboardStatisticsUseCaseInterface,
        private readonly getBookingListByDateTimeUseCase: GetBookingListByDateTimeUseCaseInterface,
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

    bookingList: RequestHandler = async (req, res, next) => {
        try {
            const shopContext = validateShopContext(req);

            const { date } = res.locals.validatedQuery as GetDashboardBookingListSchema;

            const output = await this.getBookingListByDateTimeUseCase.execute({
                shopId: shopContext.shopId,
                startTime: date,
            });

            res.status(200).json({ data: output.bookingList })
        } catch (error) {
            next(error);
        }
    }
}