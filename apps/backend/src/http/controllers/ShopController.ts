import { GetShopListUseCaseInterface } from
    "@/application/shop/interfaces/GetShopListUseCaseInterface.js";
import { GetShopDataUseCaseInterface } from
    "@/application/shop/interfaces/GetShopDataUseCaseInterface.js";
import { GetTrendingShopListUseCaseInterface } from
    "@/application/shop/interfaces/GetTrendingShopListUseCaseInterface.js";
import { CreateShopUseCaseInterface } from
    "@/application/shop/interfaces/CreateShopUseCaseInterface.js";
import { toShopListResource } from "@/http/resources/shop/GetShopListResource.js";
import { RequestHandler, Response } from "express";
import { GetShopListSchema } from "@/http/validators/shop/GetShopListSchema.js";
import { TrendingShopsResponse } from "@noq/shared";
import { CreateShopSchema } from "@/http/validators/shop/CreateShopSchema.js";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";
import { RequestWithUser } from "@/types.js";
import { GetFavouriteShopListUseCaseInterface } from "@/application/shop/interfaces/GetFavouriteShopListUseCaseInterface.js";

export class ShopController {
    constructor(
        private readonly getShopListUseCase: GetShopListUseCaseInterface,
        private readonly getShopDataUseCase: GetShopDataUseCaseInterface,
        private readonly getTrendingShopListUseCase: GetTrendingShopListUseCaseInterface,
        private readonly createShopUseCase: CreateShopUseCaseInterface,
        private readonly getFavouriteShopListUseCase: GetFavouriteShopListUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as CreateShopSchema;

            const shopId = await this.createShopUseCase.execute({
                shop: {
                    userId: body.shop.userId,
                    categoryId: body.shop.categoryId,
                    name: body.shop.name,
                    address: body.shop.address,
                    phoneNumber: body.shop.phoneNumber,
                    description: body.shop.description ?? null,
                    logoUrl: body.shop.logoUrl ?? null,
                    file: req.file ?? null,
                },
                schedule: body.schedule,
                services: body.services.map(service => ({
                    name: service.name,
                    price: service.price,
                    durationMin: service.durationMin,
                    selectedStaffs: service.selectedStaffs,
                    bufferTime: service.bufferTime ?? null,
                    description: service.description ?? null,
                })),
            });

            res.status(201).json({
                success: true,
                message: "Shop created successfully",
                data: {
                    shopId: shopId.toString(),
                },
            })
        } catch (error) {
            next(error);
        }
    }

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

    getFavourite: RequestHandler = async (req, res, next) => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const output = await this.getFavouriteShopListUseCase.execute(user.id);

            res.status(200).json(output);
        } catch (error) {
            next(error);
        }
    }
}