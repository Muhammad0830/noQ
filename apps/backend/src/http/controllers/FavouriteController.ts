import { RequestHandler, Response } from "express";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";
import { RequestWithUser } from "@/types.js";
import { GetFavouriteShopListUseCaseInterface } from "@/application/shop/interfaces/GetFavouriteShopListUseCaseInterface.js";
import { GetFavouriteServiceListUseCaseInterface } from "@/application/favourite/interfaces/GetFavouriteServiceListUseCaseInterface.js";

export class FavouriteController {
    constructor(
        private readonly getFavouriteShopListUseCase: GetFavouriteShopListUseCaseInterface,
        private readonly getFavouriteServiceListUseCase: GetFavouriteServiceListUseCaseInterface,
    ) { }

    getShopList: RequestHandler = async (req, res, next) => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const output = await this.getFavouriteShopListUseCase.execute(user.id);

            res.status(200).json(output);
        } catch (error) {
            next(error)
        }
    }

    getServiceList: RequestHandler = async (req, res, next) => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const output = await this.getFavouriteServiceListUseCase.execute(user.id);

            res.status(200).json(output);
        } catch (error) {
            next(error)
        }
    }
}