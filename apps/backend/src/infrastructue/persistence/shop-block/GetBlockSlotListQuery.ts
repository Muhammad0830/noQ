import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { GetBlockSlotListQueryInput, GetBlockSlotListQueryInterface } from "@/domain/shop-blocks/repositories/GetBlockSlotListQueryInterface.js";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import type { PrismaClient } from "@prisma/client";

export class GetBlockSlotListQuery implements GetBlockSlotListQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute(input: GetBlockSlotListQueryInput): Promise<TimeSlot[]> {
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
}