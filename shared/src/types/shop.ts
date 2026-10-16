import type { User } from "@/types/user.js";

export interface ShopCategory {
    id: string;
    name: string;
    icon?: string;
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
}