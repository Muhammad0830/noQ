import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import type { Service } from "../entities/Service.js";
import type { ServiceId } from "../value-objects/ServiceId.js";

export interface ServiceRepositoryInterface {
    findById(id: ServiceId): Promise<Service>;

    findMany(input: ServiceFindManyInput): Promise<Service[]>;

    save(service: Service): Promise<void>;

    add(service: Service): Promise<void>;

    addMany(service: Service[]): Promise<void>;

    exists(serviceId: ServiceId): Promise<boolean>;

    nextIdentity(): ServiceId;
}

export interface ServiceFindManyInput {
    limit?: number;
    searchByShopName?: string;
    categoryIdList?: ShopCategoryId[];
    minPrice?: number;
    maxPrice?: number;
}