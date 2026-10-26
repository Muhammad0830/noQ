import { GetAllShopCategoryListUseCaseInterface } from "@/application/shop-category/interfaces/GetAllShopCategoryListUseCaseInterface.js";
import { RequestHandler } from "express";
import { toCategoryListResource } from "../resources/shop-category/CategoryListResource.js";
import { CreateShopCategoryUseCaseInterface } from "@/application/shop-category/interfaces/CreateShopCategoryUseCaseInterface.js";
import { RequestWithUser } from "@/types.js";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";

export class ShopCategoryController {
    constructor(
        private readonly getAllShopCategoryListUseCase: GetAllShopCategoryListUseCaseInterface,
        private readonly createShopCategoryUseCase: CreateShopCategoryUseCaseInterface,
    ) { }

    all: RequestHandler = async (req, res, next) => {
        try {
            const categoryList = await this.getAllShopCategoryListUseCase.execute();

            res.status(200).json(toCategoryListResource(categoryList));
        } catch (error) {
            next(error);
        }
    }

    create: RequestHandler = async (req, res, next) => {
        try {
            if (!checkUserAuthenticated(req as RequestWithUser, res)) {
                return;
            }

            const output = await this.createShopCategoryUseCase.execute(req.body);

            res.status(201).json({
                success: true,
                data: {
                    id: output.id.toString(),
                    name: output.name,
                },
            })
        } catch (error) {
            next(error);
        }
    }
}