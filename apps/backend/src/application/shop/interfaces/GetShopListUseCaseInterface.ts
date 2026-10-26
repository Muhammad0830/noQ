import { Service } from "@/domain/service/entities/Service.js";
import { Shop } from "@/domain/shop/entities/Shop.js";
import { DiscoveryShopsResponse } from "@noq/shared";

export interface GetShopListUseCaseInput {
    categoryIdList?: string[];
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
}

export interface GetShopListUseCaseInterface {
    execute(input: GetShopListUseCaseInput): Promise<GetShopListUseCaseOutput>;
}

export interface GetShopListUseCaseOutput {
    shops: Shop[];
    services: Service[];
}