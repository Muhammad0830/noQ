import type { BookingAvailabilityCheckerInput, BookingAvailabilityCheckerQueryInterface } from "@/application/booking/read-queries/BookingAvailabilityCheckerQueryInterface.js";
import type { PrismaClient } from "@prisma/client";

export class PrismaBookingAvailabilityCheckerQuery implements BookingAvailabilityCheckerQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async hasConflict(input: BookingAvailabilityCheckerInput): Promise<boolean> {
        const conflictBooking = await this.prisma.booking.findFirst({
            where: {
                shopId: input.shopId.toString(),
                status: { notIn: ["CANCELLED", "NO_SHOW"] },
                startTime: { lt: input.endTime.getValue() },
                endTime: { gt: input.startTime.getValue() },
            },
        });

        const conflictBlock = await this.prisma.shopBlock.findFirst({
            where: {
                shopId: input.shopId.toString(),
                startTime: { lt: input.endTime.getValue() },
                endTime: { gt: input.startTime.getValue() },
            },
        });

        return Boolean(conflictBooking || conflictBlock);
    }
}