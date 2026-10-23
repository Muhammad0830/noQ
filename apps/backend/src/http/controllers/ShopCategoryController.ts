import { GetAllShopCategoryListUseCaseInterface } from "@/application/shop-category/interfaces/GetAllShopCategoryListUseCaseInterface.js";
import { RequestHandler } from "express";
import { toCategoryListResource } from "../resources/shop-category/CategoryListResource.js";

export class ShopCategoryController {
    constructor(
        private readonly getAllShopCategoryListUseCase: GetAllShopCategoryListUseCaseInterface,
    ) { }

    all: RequestHandler = async (req, res, next) => {
        try {
            const categoryList = await this.getAllShopCategoryListUseCase.execute();

            res.status(200).json(toCategoryListResource(categoryList));
        } catch (error) {
            next(error);
        }
    }
}