import type { User, Service, Review } from "@/index.js";

export interface ShopCategory {
    id: string;
    name: string;
    icon?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Shop {
    id: string;
    ownerId: string;
    categoryId: string;
    name: string;
    description: string | null;
    isOpen: boolean;
    address: string;
    createdAt: Date;
    updatedAt: Date;
    phoneNumber: string;
    backgroundImageUrl: string | null;
    logoUrl: string | null;
    timezone: string;
    category: ShopCategory;
}

export interface ShopWithRating extends Shop {
    averageRating: number;
    reviewCount: number;
}

export interface ShopForDiscovery extends ShopWithRating {
    owner?: User;
    services: string[];
}

export type ShopInBookingData = Pick<Shop,
    'id' |
    'name' |
    'address' |
    'backgroundImageUrl'
>

export interface DiscoveryShopsResponse {
    shops: ShopWithRating[];
    services: Service[];
    nextServiceCursor?: string;
    nextShopCursor?: string;
}

export interface TrendingShop extends Omit<ShopWithRating, 'reviews'> {
    services: string[];
    servicesCount: number;
}

export interface TrendingShopsResponse {
    shopList: TrendingShop[]
}

export interface ShopWithService extends ShopWithRating {
    services: Service[]
}

export interface ShopDetails extends Shop {
    openTime: string;
    closeTime: string;
    staffs: User[];
    services: Service[];
    reviews: Review[];
}