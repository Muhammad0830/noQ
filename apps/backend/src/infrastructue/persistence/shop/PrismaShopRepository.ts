import { OwnerId } from "@/domain/owner/value-objects/OwnerId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { Shop } from "@/domain/shop/entities/Shop.js";
import { ShopFindManyInput, ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { Prisma, PrismaClient, Shop as ShopModel } from "@prisma/client";

type ShopModelWithCategory = Prisma.ShopGetPayload<{
    include: {
        category: true,
    },
}>

export class PrismaShopRepository implements ShopRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(id: ShopId): Promise<Shop> {
        const shop = await this.prisma.shop.findUnique({
            where: {
                id: id.toString(),
            },
            include: {
                category: true,
            },
        });

        if (!shop) {
            throw new Error("Shop not found");
        }

        return this.toEntity(shop);
    }

    async findMany(input: ShopFindManyInput): Promise<Shop[]> {
        const shopList = await this.prisma.shop.findMany({
            where: {
                isOpen: true,
                ...(input.search && {
                    name: {
                        contains: input.search,
                        mode: "insensitive",
                    }
                }),
                ...(input.categoryIdList && {
                    categoryId: {
                        in: input.categoryIdList.map(id => id.toString()),
                    },
                }),
            },
            take: input.limit,
            include: { category: true },
            orderBy: { createdAt: "desc" }
        });

        return shopList.map(shop => this.toEntity(shop));
    }

    async add(shop: Shop): Promise<void> {
        await this.prisma.shop.create({
            data: {
                id: shop.getId().toString(),
                ownerId: shop.getOwnerId().toString(),
                categoryId: shop.getCategory().getId().toString(),
                name: shop.getName(),
                isOpen: shop.isOpen(),
                createdAt: shop.getCreatedAt().getValue(),
                updatedAt: shop.getUpdatedAt().getValue(),
                address: shop.getAddress(),
                phone: shop.getPhoneNumber(),
                ...(shop.getDescription() && {
                    description: shop.getDescription(),
                }),
                ...(shop.getLogoUrl() && {
                    logoUrl: shop.getLogoUrl(),
                }),
                ...(shop.getBackgroundImageUrl() && {
                    backgroundImageUrl: shop.getBackgroundImageUrl()
                }),
            }
        });
    }

    async save(shop: Shop): Promise<void> {
        await this.prisma.shop.update({
            where: {
                id: shop.getId().toString(),
            },
            data: {
                name: shop.getName(),
                isOpen: shop.isOpen(),
                updatedAt: shop.getUpdatedAt().getValue(),
                address: shop.getAddress(),
                ...(shop.getDescription() && {
                    description: shop.getDescription(),
                }),
                ...(shop.getLogoUrl() && {
                    logoUrl: shop.getLogoUrl(),
                }),
                ...(shop.getPhoneNumber() && {
                    phone: shop.getPhoneNumber()
                }),
                ...(shop.getBackgroundImageUrl() && {
                    backgroundImageUrl: shop.getBackgroundImageUrl()
                }),
            }
        });
    }

    nextIdentity(): ShopId {
        return ShopId.create();
    }

    private toEntity(model: ShopModelWithCategory): Shop {
        return Shop.create({
            id: ShopId.create(model.id),
            ownerId: OwnerId.create(model.ownerId),
            category: ShopCategory.create({
                id: ShopCategoryId.create(model.categoryId),
                name: model.category.name,
                icon: model.category.icon,
            }),
            name: model.name,
            isOpen: model.isOpen,
            address: model.address,
            phone: model.phone,
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
            ...(model.description && {
                description: model.description,
            }),
            ...(model.logoUrl && {
                logoUrl: model.logoUrl,
            }),
            ...(model.backgroundImageUrl && {
                backgroundImageUrl: model.backgroundImageUrl
            }),
        })
    }
}