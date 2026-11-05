import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetServiceDataQueryInterface {
    getTrending(timeRange: number, limit: number): Promise<GetTrendingServiceListDTO>;

    getDetails(serviceId: ServiceId): Promise<ServiceDetailsDTO>;

    getServiceReviewList(serviceId: ServiceId): Promise<ServiceWithReviewsDTO>;

    getByShopId(shopId: ShopId): Promise<ServiceDetailsDTO[]>;
}

export interface GetTrendingServiceListDTO {
    serviceList: {
        id: string;
        shopId: string;
        name: string;
        description: string | null;
        price: number;
        durationMin: number;
        bufferTime: number | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[];
}

export interface ServiceDetailsDTO {
    id: string;
    shopId: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
    bufferTime: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceWithReviewsDTO {
    id: string;
    shopId: string;
    name: string;
    description: string | null;
    price: number;
    durationMin: number;
    bufferTime: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    reviews: ReviewItem[]
}

export interface ReviewItem {
    id: string;
    serviceId: string | null;
    shopId: string;
    userId: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        avatarUrl: string | null;
    }
    shop: {
        id: string;
        name: string;
    }
}