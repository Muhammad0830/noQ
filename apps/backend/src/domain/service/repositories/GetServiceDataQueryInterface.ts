export interface GetServiceDataQueryInterface {
    getTrending(timeRange: number, limit: number): Promise<GetTrendingServiceListDTO>;
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