import { Service } from "@/domain/service/entities/Service.js";
import type { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { Money } from "@/domain/shared/value-objects/Money.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { PrismaClient, Service as ServiceModel } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

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
                durationMin: service.getDuration(),
                bufferTime: service.getBufferTime(),
                updated: service.getUpdatedAt(),
            }
        })
    }

    async findById(id: ServiceId): Promise<Service | null> {
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

    nextIdentity(value?: string): ServiceId {
        return ServiceId.create(value ?? uuidv4())
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