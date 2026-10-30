import { GetServiceDataQueryInterface, GetTrendingServiceListDTO, ServiceDetailsDTO, ServiceWithReviewsDTO } from "@/application/service/interfaces/GetServiceDataQueryInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
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

    async getDetails(serviceId: ServiceId): Promise<ServiceDetailsDTO> {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId.toString() },
        });

        if (!service) {
            throw new Error("Service not found");
        }

        return {
            id: service.id,
            shopId: service.shopId,
            name: service.name,
            description: service.description,
            price: Number(service.price),
            durationMin: service.durationMin,
            bufferTime: service.bufferTime,
            isActive: service.isActive,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        }
    }

    async getServiceReviewList(serviceId: ServiceId): Promise<ServiceWithReviewsDTO> {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId.toString() },
            include: {
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                        shop: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                },
            },
        });

        if (!service) {
            throw new Error("Service not found");
        }

        return {
            id: service.id,
            shopId: service.shopId,
            isActive: service.isActive,
            name: service.name,
            description: service.description,
            price: Number(service.price),
            bufferTime: service.bufferTime,
            durationMin: service.durationMin,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
            reviews: service.reviews.map(review => ({
                id: review.id,
                serviceId: review.serviceId,
                shopId: review.shopId,
                userId: review.userId,
                rating: review.rating,
                comment: review.comment,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: {
                    id: review.user.id,
                    name: review.user.name,
                    avatarUrl: review.user.avatarUrl,
                },
                shop: {
                    id: review.shop.id,
                    name: review.shop.name,
                }
            })),
        };
    }
}