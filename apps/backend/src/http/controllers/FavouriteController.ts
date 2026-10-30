import { RequestHandler, Response } from "express";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";
import { RequestWithUser } from "@/types.js";
import { GetFavouriteServiceListUseCaseInterface } from "@/application/favourite/interfaces/GetFavouriteServiceListUseCaseInterface.js";
import { GetFavouriteShopListUseCaseInterface } from "@/application/favourite/interfaces/GetFavouriteShopListUseCaseInterface.js";
import { AddToFavouriteShopsUseCaseInterface } from "@/application/favourite/interfaces/AddToFavouriteShopsUseCaseInterface.js";
import { RemoveFromFavouriteShopUseCaseInterface } from "@/application/favourite/interfaces/RemoveFromFavouriteShopUseCaseInterface.js";
import { AddToFavouriteServiceUseCaseInterface } from "@/application/favourite/interfaces/AddToFavouriteServiceUseCase.js";
import { RemoveFromFavouriteServiceUseCaseInterface } from "@/application/favourite/interfaces/RemoveFromFavouriteServiceUseCaseInterface.js";
import { AddShopToFavouriteSchema } from "../validators/favourite/AddShopToFavouriteSchema.js";
import { AddServiceToFavouriteSchema } from "../validators/favourite/AddServiceToFavouriteSchema.js";

export class FavouriteController {
    constructor(
        private readonly getFavouriteShopListUseCase: GetFavouriteShopListUseCaseInterface,
        private readonly addToFavouriteShopUseCase: AddToFavouriteShopsUseCaseInterface,
        private readonly removeFromFavouriteShopUseCase: RemoveFromFavouriteShopUseCaseInterface,
        private readonly getFavouriteServiceListUseCase: GetFavouriteServiceListUseCaseInterface,
        private readonly addToFavouriteServiceUseCase: AddToFavouriteServiceUseCaseInterface,
        private readonly removeFromFavouriteServiceUseCase: RemoveFromFavouriteServiceUseCaseInterface,
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

    addShopToFavourite: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as AddShopToFavouriteSchema;

            const favouriteShopId = await this.addToFavouriteShopUseCase.execute(body);

            res.status(201).json({
                success: true,
                message: "Shop added to favourite successfully",
                data: {
                    favouriteShopId: favouriteShopId.toString(),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    removeShopFromFavourite: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            await this.removeFromFavouriteShopUseCase.execute({
                shopId: id,
                userId: user.id
            });

            res.status(201).json({
                success: true,
                message: "The Shop removed from favourite successfully",
            });
        } catch (error) {
            next(error);
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

    addServiceToFavourite: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as AddServiceToFavouriteSchema;

            const favouriteServiceId = await this.addToFavouriteServiceUseCase.execute(body);

            res.status(201).json({
                success: true,
                message: "Service added to favourite successfully",
                data: {
                    favouriteServiceId: favouriteServiceId.toString(),
                },
            });
        } catch (error) {
            next(error);
        }
    }

    removeServiceFromFavourite: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            await this.removeFromFavouriteServiceUseCase.execute({
                serviceId: id,
                userId: user.id,
            });

            res.status(201).json({
                success: true,
                message: "The Service removed from favourite successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}