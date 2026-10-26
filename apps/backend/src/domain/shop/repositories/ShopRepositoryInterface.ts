import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { Shop } from "@/domain/shop/entities/Shop.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface ShopFindManyInput {
    limit?: number;
    search?: string;
    categoryIdList?: ShopCategoryId[];
}

export interface ShopRepositoryInterface {
    findById(id: ShopId): Promise<Shop>;

    findMany(input: ShopFindManyInput): Promise<Shop[]>;

    add(shop: Shop): Promise<void>;

    save(shop: Shop): Promise<void>;

    nextIdentity(): ShopId;
}