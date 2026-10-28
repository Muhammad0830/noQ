import { Service } from "@/domain/service/entities/Service.js";
import type { ServiceFindManyInput, ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { Money } from "@/domain/shared/value-objects/Money.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { PrismaClient, Service as ServiceModel } from "@prisma/client";

export class PrismaServiceRepository implements ServiceRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async save(service: Service): Promise<void> {
        await this.prisma.service.create({
            data: {
                id: service.getId().toString(),
                shopId: service.getShopId().toString(),
                name: service.getName(),
                description: service.getDescription(),
                price: service.getPrice().amount,
                durationMin: service.getDurationMin(),
                bufferTime: service.getBufferTime(),
                updatedAt: service.getUpdatedAt().getValue(),
            }
        })
    }

    async findById(id: ServiceId): Promise<Service> {
        const serviceModel = await this.prisma.service.findUnique({
            where: {
                id: id.toString(),
            },
        })

        if (!serviceModel) {
            throw new Error("Service not found");
        }

        return this.toEntity(serviceModel)
    }

    async findMany(input: ServiceFindManyInput): Promise<Service[]> {
        const serviceList = await this.prisma.service.findMany({
            where: {
                isActive: true,
                ...(input.searchByShopName && {
                    shop: {
                        name: {
                            contains: input.searchByShopName,
                            mode: "insensitive",
                        },
                    },
                }),
                ...(input.categoryIdList && input.categoryIdList.length > 0 && {
                    shop: {
                        categoryId: {
                            in: input.categoryIdList.map(id => id.toString()),
                        },
                    },
                }),
                ...(input.minPrice && input.maxPrice && {
                    price: {
                        gt: input.minPrice,
                        lt: input.maxPrice,
                    },
                }),
            },
            take: input.limit,
        });

        return serviceList.map(service => this.toEntity(service));
    }

    async exists(serviceId: ServiceId): Promise<boolean> {
        const service = await this.prisma.service.findFirst({
            where: { id: serviceId.toString() },
        });

        return !!service;
    }

    nextIdentity(value?: string): ServiceId {
        return ServiceId.create(value)
    }

    private toEntity(service: ServiceModel): Service {
        return Service.create({
            ...service,
            id: ServiceId.create(service.id),
            shopId: ShopId.create(service.shopId),
            price: Money.fromAmount(Number(service.price), "UZS"),
            createdAt: DateTime.from(service.createdAt),
            updatedAt: DateTime.from(service.updatedAt),
        });
    }
}