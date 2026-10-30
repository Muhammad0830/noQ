import { GetServiceDataQueryInterface, GetTrendingServiceListDTO } from "@/domain/service/repositories/GetServiceDataQueryInterface.js";
import { BookingStatus, PrismaClient } from "@prisma/client";

export class GetServiceDataQuery implements GetServiceDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getTrending(timeRange: number, limit: number): Promise<GetTrendingServiceListDTO> {
        const serviceWithIdList = await this.prisma.booking.groupBy({
            by: ["serviceId"],
            where: {
                status: BookingStatus.COMPLETED,
                endTime: { gte: new Date(Date.now() - timeRange) },
            },
            orderBy: {
                _count: {
                    serviceId: "desc",
                },
            },
            take: limit,
        });

        const filteredIdList = serviceWithIdList.map(service => service.serviceId).filter(id => id !== null);

        const serviceList = await this.prisma.service.findMany({
            where: {
                isActive: true,
                id: { in: filteredIdList }
            },
        });

        return {
            serviceList: serviceList.map(service => ({
                id: service.id,
                shopId: service.shopId,
                name: service.name,
                isActive: service.isActive,
                price: Number(service.price),
                durationMin: service.durationMin,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
                bufferTime: service.bufferTime,
                description: service.description
            }))
        };
    }
}