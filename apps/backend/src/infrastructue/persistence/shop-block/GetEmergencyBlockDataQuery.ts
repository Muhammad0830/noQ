import { EmergencyBlockDTO, getEmergencyBlockDataQueryInput, GetEmergencyBlockListQueryInterface } from "@/application/shop-block/interfaces/GetEmergencyBlockListQueryInterface.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { PrismaClient } from "@prisma/client";

export class GetEmergencyBlockDataQuery implements GetEmergencyBlockListQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getListByTime(input: getEmergencyBlockDataQueryInput): Promise<TimeSlot[]> {
        const blocks = await this.prisma.shopBlock.findMany({
            where: {
                shopId: input.shopId.toString(),
                startTime: {
                    gte: input.startTime.getValue(),
                    lte: input.endTime.getValue(),
                },
            },
            select: {
                startTime: true,
                endTime: true,
            }
        });

        return blocks.map(block => TimeSlot.create({
            start: DateTime.from(block.startTime),
            end: DateTime.from(block.endTime),
        }))
    }

    async getListByShopId(shopId: ShopId): Promise<EmergencyBlockDTO> {
        const emergencyBlockList = await this.prisma.shopBlock.findMany({
            where: {
                shopId: shopId.toString(),
                startTime: { gte: new Date(Date.now()) },
            },
            orderBy: { startTime: "asc" },
        });

        return {
            blocks: emergencyBlockList.map(block => ({
                id: block.id,
                shopId: block.shopId,
                startTime: block.startTime,
                endTime: block.endTime,
                reason: block.reason,
            })),
        };
    }
}