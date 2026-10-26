import type { User, Staff, Service } from "@/index.js";

export interface ShopCategory {
    id: string;
    name: string;
    icon?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Shop {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    backgroundImageUrl?: string;
    address: string;
    phoneNumber: string;
    categoryId: string;
    openTime: string | null;
    closeTime: string | null;
    category?: ShopCategory;
    ownerId: string;
    timeZone: string;
    owner?: User;
    isOpen: boolean;
    createdAt: string;
    averageRating?: number;
    reviewCount?: number;
    services: string[];
    staff: Staff[];
}

export type ShopInBookingData = Pick<Shop,
    'id' |
    'name' |
    'address' |
    'backgroundImageUrl'
>

export interface DiscoveryShopsResponse {
    shops: Shop[];
    services: Service[];
    nextServiceCursor?: string;
    nextShopCursor?: string;
}