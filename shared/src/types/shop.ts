import type { User } from "@/types/user.js";
import type { Staff } from "@/types/staff.js";

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
    phone?: string;
    categoryId: string;
    category?: ShopCategory;
    ownerId: string;
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