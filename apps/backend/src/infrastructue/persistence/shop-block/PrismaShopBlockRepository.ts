import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopBlock } from "@/domain/shop-block/entities/ShopBlock.js";
import { ShopBlockRepositoryInterface } from "@/domain/shop-block/repositories/ShopBlockRepositoryInterface.js";
import { ShopBlockId } from "@/domain/shop-block/value-objects/ShopBlockId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { Prisma, PrismaClient, ShopBlock as ShopBlockModel } from "@prisma/client";

export type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class PrismaShopBlockRepository implements ShopBlockRepositoryInterface {
    constructor(
        private readonly prisma: PrismaExecutor,
    ) { }

    async findById(id: ShopBlockId): Promise<ShopBlock> {
        const shopBlock = await this.prisma.shopBlock.findUnique({
            where: {
                id: id.toString(),
            },
        });

        if (!shopBlock) {
            throw new Error("Emergency blocked time not found");
        }

        return this.toEntity(shopBlock);
    }

    async add(shopBlock: ShopBlock): Promise<void> {
        await this.prisma.shopBlock.create({
            data: {
                id: shopBlock.getId().toString(),
                shopId: shopBlock.getShopId().toString(),
                startTime: shopBlock.getStartTime().getValue(),
                endTime: shopBlock.getEndTime().getValue(),
                reason: shopBlock.getReason() || "No reason provided",
            },
        });
    }

    async addMany(shopBlockList: ShopBlock[]): Promise<void> {
        await this.prisma.shopBlock.createMany({
            data: shopBlockList.map(block => ({
                id: block.getId().toString(),
                shopId: block.getShopId().toString(),
                startTime: block.getStartTime().getValue(),
                endTime: block.getEndTime().getValue(),
                reason: block.getReason(),
            })),
        });
    }

    async save(shopBlock: ShopBlock): Promise<void> {
        await this.prisma.shopBlock.update({
            where: { id: shopBlock.getId().toString() },
            data: {
                shopId: shopBlock.getShopId().toString(),
                startTime: shopBlock.getStartTime().getValue(),
                endTime: shopBlock.getEndTime().getValue(),
                reason: shopBlock.getReason() || "No reason provided",
            },
        });
    }

    nextIdentity(): ShopBlockId {
        return ShopBlockId.create();
    }

    private toEntity(model: ShopBlockModel): ShopBlock {
        return ShopBlock.create({
            id: ShopBlockId.create(model.id),
            shopId: ShopId.create(model.shopId),
            startTime: DateTime.from(model.startTime),
            endTime: DateTime.from(model.endTime),
            reason: model.reason || "No reason provided",
        })
    }
}