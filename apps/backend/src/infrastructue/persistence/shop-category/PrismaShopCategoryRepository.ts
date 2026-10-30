import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategoryRepositoryInterface } from "@/domain/shop-category/repositories/ShopCategoryRepositoryInterface.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { Prisma, PrismaClient, ShopCategory as ShopCategoryModel } from "@prisma/client";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class PrismaShopCategoryRepository implements ShopCategoryRepositoryInterface {
    constructor(
        private readonly prisma: PrismaExecutor,
    ) { }

    async findById(shopCategory: ShopCategory): Promise<ShopCategory> {
        const model = await this.prisma.shopCategory.findUnique({
            where: {
                id: shopCategory.getId().toString(),
            },
        });

        if (!model) {
            throw new Error("Shop Category not found");
        }

        return this.toEntity(model);
    }

    async all(): Promise<ShopCategory[]> {
        const categoryList = await this.prisma.shopCategory.findMany();

        return categoryList.map(category => this.toEntity(category));
    }

    async exists(categoryId: ShopCategoryId): Promise<boolean> {
        const category = await this.prisma.shopCategory.findFirst({
            where: { id: categoryId.toString() },
        });

        return !!category;
    }

    async add(shopCategory: ShopCategory): Promise<void> {
        await this.prisma.shopCategory.create({
            data: {
                id: shopCategory.getId().toString(),
                name: shopCategory.getName(),
                icon: shopCategory.getIcon(),
                createdAt: shopCategory.getCreatedAt().getValue(),
                updatedAt: shopCategory.getCreatedAt().getValue(),
            },
        });
    }

    async save(shopCategory: ShopCategory): Promise<void> {
        await this.prisma.shopCategory.update({
            where: {
                id: shopCategory.getId().toString(),
            },
            data: {
                name: shopCategory.getName(),
                icon: shopCategory.getIcon(),
                updatedAt: shopCategory.getUpdatedAt().getValue(),
            }
        });
    }

    nextIdentity(): ShopCategoryId {
        return ShopCategoryId.create();
    }

    private toEntity(model: ShopCategoryModel): ShopCategory {
        return ShopCategory.create({
            id: ShopCategoryId.create(model.id),
            name: model.name,
            icon: model.icon,
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
        })
    }
}