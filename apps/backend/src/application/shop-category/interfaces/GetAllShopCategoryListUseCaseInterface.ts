import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";

export interface GetAllShopCategoryListUseCaseInterface {
    execute(): Promise<ShopCategory[]>;
}