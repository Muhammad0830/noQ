import { RequestHandler } from "express";
import { GetTrendingServiceListUseCaseInterface } from
    "@/application/service/interfaces/GetTrendingServiceListUseCaseInterface.js";

export class ServiceController {
    constructor(
        private readonly getTrendingServiceListUseCase: GetTrendingServiceListUseCaseInterface,
    ) { }

    trending: RequestHandler = async (req, res, next) => {
        try {
            const output = await this.getTrendingServiceListUseCase.execute();

            res.status(200).json(output.serviceList);
        } catch (error) {
            next(error)
        }
    }
}