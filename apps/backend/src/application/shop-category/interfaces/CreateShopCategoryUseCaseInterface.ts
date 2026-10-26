import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";

export interface CreateShopCategoryUseCaseInput {
    name: string;
    icon: string;
}

export interface CreateShopCategoryUseCaseOutput {
    id: ShopCategoryId;
    name: string;
}

export interface CreateShopCategoryUseCaseInterface {
    execute(input: CreateShopCategoryUseCaseInput): Promise<CreateShopCategoryUseCaseOutput>;
}