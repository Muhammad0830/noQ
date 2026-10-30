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