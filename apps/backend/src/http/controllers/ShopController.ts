import { GetShopListUseCaseInterface } from "@/application/shop/interfaces/GetShopListUseCaseInterface.js";
import { RequestHandler } from "express";
import { GetShopListSchema } from "../validators/shop/GetShopListSchema.js";
import { toShopListResource } from "../resources/shop/GetShopListResource.js";
import { GetShopDataUseCaseInterface } from "@/application/shop/interfaces/GetShopDataUseCaseInterface.js";
import { GetTrendingShopListUseCaseInterface } from "@/application/shop/interfaces/GetTrendingShopListUseCaseInterface.js";
import { TrendingShopsResponse } from "@noq/shared";

export class ShopController {
    constructor(
        private readonly getShopListUseCase: GetShopListUseCaseInterface,
        private readonly getShopDataUseCase: GetShopDataUseCaseInterface,
        private readonly getTrendingShopListUseCase: GetTrendingShopListUseCaseInterface,
    ) { }

    list: RequestHandler = async (req, res, next) => {
        try {
            const query = res.locals.validatedQuery as GetShopListSchema;

            const output = await this.getShopListUseCase.execute({
                ...query,
                categoryIdList: query.categories,
            });

            res.status(200).json(toShopListResource(output));
        } catch (error) {
            next(error);
        }
    }

    getShopData: RequestHandler = async (req, res, next) => {
        try {
            const id = req.params.id as string;

            const output = await this.getShopDataUseCase.execute(id);

            res.status(200).json(output);
        } catch (error) {
            next(error);
        }
    }

    getTrending: RequestHandler = async (req, res, next) => {
        try {
            const output: TrendingShopsResponse = await this.getTrendingShopListUseCase.execute();

            res.status(200).json(output);
        } catch (error) {
            next(error)
        }
    }
}