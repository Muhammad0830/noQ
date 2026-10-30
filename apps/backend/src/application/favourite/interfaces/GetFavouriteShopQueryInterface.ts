import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface ShopItem {
    id: string;
    categoryId: string;
    ownerId: string;
    name: string;
    description: string | null;
    logoUrl: string | null;
    address: string;
    phoneNumber: string;
    isOpen: boolean;
    backgroundImageUrl: string | null;
    timezone: string;
    createdAt: Date;
    updatedAt: Date;
    category: {
        id: string;
        name: string;
        icon: string | null;
    }
}

export interface GetFavouriteShopQueryInterface {
    getList(userId: UserId): Promise<ShopItem[]>;
}