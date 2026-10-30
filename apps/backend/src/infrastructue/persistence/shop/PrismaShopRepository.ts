import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { Shop } from "@/domain/shop/entities/Shop.js";
import { ShopFindManyInput, ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { Prisma, PrismaClient, Shop as ShopModel } from "@prisma/client";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class PrismaShopRepository implements ShopRepositoryInterface {
    constructor(
        private readonly prisma: PrismaExecutor,
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
                ...(input.idList && {
                    id: { in: input.idList.map(id => id.toString()) }
                }),
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
            orderBy: { createdAt: "desc" },
        });

        return shopList.map(shop => this.toEntity(shop));
    }

    async exists(shopId: ShopId): Promise<boolean> {
        const shop = await this.prisma.shop.findFirst({
            where: { id: shopId.toString() }
        });

        return !!shop;
    }

    async add(shop: Shop): Promise<void> {
        await this.prisma.shop.create({
            data: {
                id: shop.getId().toString(),
                ownerId: shop.getOwnerId().toString(),
                categoryId: shop.getCategoryId().toString(),
                name: shop.getName(),
                isOpen: shop.isOpen(),
                createdAt: shop.getCreatedAt().getValue(),
                updatedAt: shop.getUpdatedAt().getValue(),
                address: shop.getAddress(),
                phone: shop.getPhoneNumber(),
                description: shop.getDescription(),
                logoUrl: shop.getLogoUrl(),
                backgroundImageUrl: shop.getBackgroundImageUrl()
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
                description: shop.getDescription(),
                logoUrl: shop.getLogoUrl(),
                phone: shop.getPhoneNumber(),
                backgroundImageUrl: shop.getBackgroundImageUrl()
            }
        });
    }

    nextIdentity(): ShopId {
        return ShopId.create();
    }

    private toEntity(model: ShopModel): Shop {
        return Shop.create({
            id: ShopId.create(model.id),
            ownerId: UserId.create(model.ownerId),
            categoryId: ShopCategoryId.create(model.categoryId),
            name: model.name,
            isOpen: model.isOpen,
            address: model.address,
            phoneNumber: model.phone,
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
            description: model.description,
            logoUrl: model.logoUrl,
            backgroundImageUrl: model.backgroundImageUrl
        })
    }
}