import {
    FamousServiceItem,
    GetBookingDataQueryInterface,
    GetCountByTimeInput,
    GetFamousServiceListInput,
    GetPriceByTimeInput,
    GetRevenueByTimeInput,
    GetRevenueByTimeOutput
} from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
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

    async getRevenueByTime(input: GetRevenueByTimeInput): Promise<GetRevenueByTimeOutput> {
        const bookings = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            select: {
                startTime: true,
                servicePrice: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return {
            bookings: bookings.map(b => ({
                startTime: DateTime.from(b.startTime),
                servicePrice: Number(b.servicePrice),
            }))
        }
    }

    async getFamousServiceList(input: GetFamousServiceListInput): Promise<FamousServiceItem[]> {
        const services = await this.prisma.booking.groupBy({
            by: ["serviceId", "serviceName"],
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                serviceId: {
                    not: null,
                },
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    serviceId: "desc",
                },
            },
            take: 5,
        });

        return services.filter(
            (service): service is typeof service & {
                serviceId: string;
            } => service.serviceId !== null
        ).map(service => ({
            id: service.serviceId,
            name: service.serviceName,
            bookingCount: service._count._all,
        }));
    }
}