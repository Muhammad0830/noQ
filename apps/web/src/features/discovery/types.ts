import { Shop } from "@/shared/types/shop";
import { Service } from "@noq/shared";

export interface GetShopsParams {
    isSearching: boolean;
    searchTerm: string;
    filter: FilterType;
}

export interface FilterType {
    categories: string[];
    priceEnabled: boolean;
    minPrice: number;
    maxPrice: number;
}

export interface ShopsResponse {
    shops: Shop[];
    services: Service[];
    nextServiceCursor?: string;
    nextShopCursor?: string;
    type?: 'search' | 'filter';
}