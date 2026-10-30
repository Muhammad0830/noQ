import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface ServiceItem {
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
    shop: {
        id: string;
        ownerId: string;
        categoryId: string;
        name: string;
        description: string | null;
        isOpen: boolean;
        logoUrl: string | null;
        backgroundImageUrl: string | null;
        address: string;
        phoneNumber: string;
        timezone: string;
        createdAt: Date;
        updatedAt: Date;
        category: {
            id: string;
            name: string;
            icon: string | null;
        }
    }
}

export interface GetFavouriteServiceQueryInterface {
    getList(userId: UserId): Promise<ServiceItem[]>
}