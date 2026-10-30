import { GetFavouriteShopQueryInterface, ShopItem } from "@/application/favourite/interfaces/GetFavouriteShopQueryInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient } from "@prisma/client";

export class GetFavouriteShopQuery implements GetFavouriteShopQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getList(userId: UserId): Promise<ShopItem[]> {
        const favouriteShopList = await this.prisma.favoriteShop.findMany({
            where: { userId: userId.toString() },
            include: {
                shop: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return favouriteShopList.map(favourite => ({
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
        }))
    }
}