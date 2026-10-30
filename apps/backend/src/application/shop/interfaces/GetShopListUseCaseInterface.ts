import { Service } from "@/domain/service/entities/Service.js";
import { GetShopForDiscoveryOutput } from "./GetShopListQueryInterface.js";

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
    shops: GetShopForDiscoveryOutput;
    services: Service[];
}