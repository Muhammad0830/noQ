import { ServiceItem } from "@/application/favourite/interfaces/GetFavouriteServiceQueryInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient } from "@prisma/client";

export class GetFavouriteServiceQuery {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getList(userId: UserId): Promise<ServiceItem[]> {
        const favouriteServiceList = await this.prisma.favoriteService.findMany({
            where: { userId: userId.toString() },
            include: {
                service: {
                    include: {
                        shop: {
                            include: {
                                category: true
                            },
                        },
                    },
                },
            },
        });

        return favouriteServiceList.map(favourite => ({
            id: favourite.service.id,
            shopId: favourite.service.shopId,
            name: favourite.service.name,
            description: favourite.service.description,
            price: Number(favourite.service.price),
            durationMin: favourite.service.durationMin,
            bufferTime: favourite.service.bufferTime,
            isActive: favourite.service.isActive,
            createdAt: favourite.service.createdAt,
            updatedAt: favourite.service.updatedAt,
            shop: {
                id: favourite.service.shop.id,
                categoryId: favourite.service.shop.categoryId,
                ownerId: favourite.service.shop.ownerId,
                name: favourite.service.shop.name,
                description: favourite.service.shop.description,
                isOpen: favourite.service.shop.isOpen,
                logoUrl: favourite.service.shop.logoUrl,
                backgroundImageUrl: favourite.service.shop.backgroundImageUrl,
                createdAt: favourite.service.shop.createdAt,
                updatedAt: favourite.service.shop.updatedAt,
                address: favourite.service.shop.address,
                phoneNumber: favourite.service.shop.phone,
                timezone: favourite.service.shop.timezone,
                category: {
                    id: favourite.service.shop.category.id,
                    name: favourite.service.shop.category.name,
                    icon: favourite.service.shop.category.icon,
                }
            }
        }))
    }
}