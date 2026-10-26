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