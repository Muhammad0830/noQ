import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategoryId } from "../value-objects/ShopCategoryId.js";

export interface ShopCategoryRepositoryInterface {
    findById(shopCategory: ShopCategory): Promise<ShopCategory>;

    all(): Promise<ShopCategory[]>;

    add(shopCategory: ShopCategory): Promise<void>;

    save(shopCategory: ShopCategory): Promise<void>;

    nextIdentity(): ShopCategoryId;
}