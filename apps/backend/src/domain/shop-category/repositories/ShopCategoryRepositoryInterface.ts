import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";

export interface ShopCategoryRepositoryInterface {
    findById(shopCategory: ShopCategory): Promise<ShopCategory>;

    all(): Promise<ShopCategory[]>;

    add(shopCategory: ShopCategory): Promise<void>;

    save(shopCategory: ShopCategory): Promise<void>;
}