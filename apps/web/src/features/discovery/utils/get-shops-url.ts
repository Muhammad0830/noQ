import { API_ENDPOINTS } from "@/lib/api";
import { GetShopsParams } from "../types";

export function getShopsUrl({
    isSearching,
    searchTerm,
    filter
}: GetShopsParams): string {
    const params = new URLSearchParams();

    if (isSearching) {
        params.set("search", searchTerm);
    }

    if (filter.categories.length > 0) {
        params.set("categoryIds", filter.categories.join(","));
    }

    if (filter.priceEnabled) {
        params.set("minPrice", String(filter.minPrice));
        params.set("maxPrice", String(filter.maxPrice));
    }

    const queryString = params.toString() ? `&${params.toString()}` : '';

    return `${API_ENDPOINTS.shops}?limit=10${queryString}`;
}