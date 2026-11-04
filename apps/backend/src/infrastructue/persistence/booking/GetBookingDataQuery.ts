import {
    GetBookingDataQueryInterface,
    GetCountByTimeInput,
    GetPriceByTimeInput
} from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { PrismaClient } from "@prisma/client";

export class GetBookingDataQuery implements GetBookingDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getCountByTime(input: GetCountByTimeInput): Promise<number> {
        return await this.prisma.booking.count({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lte: input.endTime.getValue(),
                },
            },
        });
    }

    async getPriceListByTime(input: GetPriceByTimeInput): Promise<number[]> {
        const services = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            select: {
                servicePrice: true
            },
        });

        return services.flatMap(s => Number(s.servicePrice))
    }
}