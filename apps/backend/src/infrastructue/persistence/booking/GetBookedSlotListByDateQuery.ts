import type {
    GetBookedSlotListByDateQueryInput,
    GetBookedSlotListByDateQueryInterface
} from "@/application/booking/read-queries/GetBookedSlotListByDateQueryInterface.js";
import type { PrismaClient } from "@prisma/client";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";

export class GetBookedSlotListByDateQuery implements GetBookedSlotListByDateQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute(
        input: GetBookedSlotListByDateQueryInput
    ): Promise<TimeSlot[]> {
        const bookings = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                startTime: {
                    gte: input.startTime.getValue(),
                    lte: input.endTime.getValue(),
                },
            },
            select: {
                startTime: true,
                endTime: true
            },
        });

        return bookings.map(booking => TimeSlot.create({
            start: DateTime.from(booking.startTime),
            end: DateTime.from(booking.endTime),
        }))
    }
}