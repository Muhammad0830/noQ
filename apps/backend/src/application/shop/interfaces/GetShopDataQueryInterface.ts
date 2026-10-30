import { UserRoleValue } from "@/domain/shared/value-objects/UserRole.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserRoleType } from "@noq/shared";

export interface GetShopDataQueryOutput {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    phoneNumber: string;
    address: string;
    backgroundImageUrl: string | null;
    isOpen: boolean;
    createdAt: Date;
    updatedAt: Date;
    averageRating: number;
    reviewCount: number;
    openTime: string | null;
    closeTime: string | null;
    category: {
        id: string;
        name: string;
        icon: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
    staffs: {
        id: string;
        name: string;
        email: string;
        role: UserRoleValue;
        createdAt: Date;
        updatedAt: Date;
        avatarUrl: string | null;
        phoneNumber: string | null;
    }[];
    services: {
        id: string;
        shopId: string;
        name: string;
        description: string | null;
        price: number;
        durationMin: number;
        isActive: boolean;
        bufferTime: number | null;
        createdAt: Date;
        updatedAt: Date;
        reviewCount: number;
    }[];
    reviews: {
        id: string;
        userId: string;
        rating: number;
        shopId: string | null;
        serviceId: string | null;
        comment: string | null;
        createdAt: Date;
        updatedAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
            role: UserRoleType;
            avatarUrl: string | null;
            phoneNumber: string | null;
            createdAt: Date;
            updatedAt: Date;
        },
    }[];
}

export interface GetShopDataQueryInterface {
    execute(id: ShopId): Promise<GetShopDataQueryOutput>;
}