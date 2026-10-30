import { FavouriteShopListDTO, GetShopForDiscoveryOutput, GetShopListQueryInterface } from "@/application/shop/interfaces/GetShopListQueryInterface.js";
import { GetTrendingShopListUseCaseOutput } from "@/application/shop/interfaces/GetTrendingShopListUseCaseInterface.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient } from "@prisma/client";

export class GetShopListQuery implements GetShopListQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getBySearch(
        search: string,
        limit: number
    ): Promise<GetShopForDiscoveryOutput> {
        const shopList = await this.prisma.shop.findMany({
            where: {
                isOpen: true,
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            },
            take: limit,
            include: {
                category: true,
                reviews: { select: { rating: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const ratingByShopId = await this.getRatingByShopIdList(shopList.map(s => s.id))

        return {
            shopList: shopList.map(shop => {
                const rating = ratingByShopId.get(shop.id);

                return ({
                    id: shop.id,
                    ownerId: shop.ownerId,
                    categoryId: shop.categoryId,
                    name: shop.name,
                    isOpen: shop.isOpen,
                    address: shop.address,
                    createdAt: shop.createdAt,
                    updatedAt: shop.updatedAt,
                    description: shop.description,
                    logoUrl: shop.logoUrl,
                    phoneNumber: shop.phone,
                    backgroundImageUrl: shop.backgroundImageUrl,
                    category: shop.category,
                    averageRating: rating?.averageRating ?? 0,
                    reviewCount: rating?.reviewCount ?? 0,
                })
            })
        }
    }

    async getByCategoryIdList(
        categoryIdList: ShopCategoryId[],
        limit: number
    ): Promise<GetShopForDiscoveryOutput> {
        const shopList = await this.prisma.shop.findMany({
            where: {
                isOpen: true,
                categoryId: {
                    in: categoryIdList.map(id => id.toString()),
                },
            },
            take: limit,
            include: {
                category: true,
                reviews: { select: { rating: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const ratingByShopId = await this.getRatingByShopIdList(shopList.map(s => s.id))

        return {
            shopList: shopList.map(shop => {
                const rating = ratingByShopId.get(shop.id);

                return ({
                    id: shop.id,
                    ownerId: shop.ownerId,
                    categoryId: shop.categoryId,
                    name: shop.name,
                    isOpen: shop.isOpen,
                    address: shop.address,
                    createdAt: shop.createdAt,
                    updatedAt: shop.updatedAt,
                    description: shop.description,
                    logoUrl: shop.logoUrl,
                    phoneNumber: shop.phone,
                    backgroundImageUrl: shop.backgroundImageUrl,
                    category: shop.category,
                    averageRating: rating?.averageRating ?? 0,
                    reviewCount: rating?.reviewCount ?? 0,
                })
            })
        }
    }

    async getTrendingList(timeRange: number): Promise<GetTrendingShopListUseCaseOutput> {
        const shopIdList = await this.prisma.booking.groupBy({
            by: ["shopId"],
            where: {
                status: "COMPLETED",
                endTime: {
                    gte: new Date(Date.now() - timeRange),
                },
            },
            orderBy: {
                _count: {
                    shopId: "desc",
                },
            },
            take: 10,
        });

        const shopList = await this.prisma.shop.findMany({
            where: {
                id: { in: shopIdList.map(idObject => idObject.shopId) },
            },
            include: {
                reviews: {
                    select: { rating: true },
                },
                services: {
                    select: { name: true },
                },
                category: true,
                _count: {
                    select: { services: true, reviews: true },
                },
            },
        });

        const ratingByShopId = await this.getRatingByShopIdList(shopList.map(s => s.id))

        return {
            shopList: shopList.map(shop => {
                const rating = ratingByShopId.get(shop.id);

                return ({
                    id: shop.id,
                    categoryId: shop.categoryId,
                    ownerId: shop.ownerId,
                    name: shop.name,
                    description: shop.description,
                    timezone: shop.timezone,
                    isOpen: shop.isOpen,
                    address: shop.address,
                    createdAt: shop.createdAt,
                    updatedAt: shop.updatedAt,
                    phoneNumber: shop.phone,
                    backgroundImageUrl: shop.backgroundImageUrl,
                    logoUrl: shop.logoUrl,
                    services: shop.services.map(s => s.name),
                    servicesCount: shop._count.services,
                    averageRating: rating?.averageRating ?? 0,
                    reviewCount: rating?.reviewCount ?? 0,
                    category: shop.category,
                })
            }),
        };
    }

    async getFavouriteList(userId: UserId): Promise<FavouriteShopListDTO> {
        const shopList = await this.prisma.favoriteShop.findMany({
            where: { userId: userId.toString() },
            include: {
                shop: {
                    include: { category: true },
                },
            },
        });

        return {
            shopList: shopList.map(favourite => ({
                id: favourite.shop.id,
                ownerId: favourite.shop.ownerId,
                categoryId: favourite.shop.categoryId,
                name: favourite.shop.name,
                description: favourite.shop.description,
                logoUrl: favourite.shop.logoUrl,
                address: favourite.shop.address,
                phoneNumber: favourite.shop.phone,
                isOpen: favourite.shop.isOpen,
                backgroundImageUrl: favourite.shop.backgroundImageUrl,
                timezone: favourite.shop.timezone,
                createdAt: favourite.shop.createdAt,
                updatedAt: favourite.shop.updatedAt,
                category: {
                    id: favourite.shop.category.id,
                    name: favourite.shop.category.name,
                    icon: favourite.shop.category.icon,
                },
            })),
        };
    }

    private async getRatingByShopIdList(shopIdList: string[]) {
        const ratings = await this.prisma.review.groupBy({
            by: ["shopId"],
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
            where: {
                shopId: {
                    in: shopIdList,
                },
            },
        });

        return new Map(
            ratings.map(item => [
                item.shopId,
                {
                    averageRating: item._avg.rating,
                    reviewCount: item._count.rating,
                },
            ]),
        );
    }
}