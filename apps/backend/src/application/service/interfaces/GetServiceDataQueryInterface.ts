import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export interface GetServiceDataQueryInterface {
    getTrending(timeRange: number, limit: number): Promise<GetTrendingServiceListDTO>;

    getDetails(serviceId: ServiceId): Promise<ServiceDetailsDTO>;
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