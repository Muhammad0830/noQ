import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { GetTrendingShopListUseCaseOutput } from "./GetTrendingShopListUseCaseInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface GetShopListQueryInterface {
    getBySearch(
        search: string,
        limit: number
    ): Promise<GetShopForDiscoveryOutput>

    getByCategoryIdList(
        categoryIdList: ShopCategoryId[],
        limit: number
    ): Promise<GetShopForDiscoveryOutput>

    getTrendingList(timeRange: number): Promise<GetTrendingShopListUseCaseOutput>;

    getFavouriteList(userId: UserId): Promise<FavouriteShopListDTO>;
}

export interface GetShopForDiscoveryOutput {
    shopList: {
        id: string,
        ownerId: string,
        categoryId: string,
        name: string,
        isOpen: boolean,
        address: string,
        createdAt: Date,
        updatedAt: Date,
        description: string | null,
        logoUrl: string | null,
        phoneNumber: string,
        backgroundImageUrl: string | null,
        category: {
            id: string;
            name: string;
            icon: string | null;
            createdAt: Date;
            updatedAt: Date;
        },
        averageRating: number,
        reviewCount: number,
    }[];
}


export interface FavouriteShop {
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

export interface FavouriteShopListDTO {
    shopList: FavouriteShop[]
}