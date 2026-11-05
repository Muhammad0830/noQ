import {
    CreateServiceUseCaseInput,
    CreateServiceUseCaseInterface
} from "../interfaces/CreateServiceUseCaseInterface.js";
import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { Service } from "@/domain/service/entities/Service.js";
import { Money } from "@/domain/shared/value-objects/Money.js";

export class CreateServiceUseCase implements CreateServiceUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) { }

    async execute(input: CreateServiceUseCaseInput): Promise<void> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const service = Service.create({
            id: this.serviceRepository.nextIdentity(),
            shopId: shopId,
            name: input.name,
            description: input.description,
            price: Money.fromAmount(input.price, "UZS"),
            durationMin: input.durationMin,
            bufferTime: input.bufferTime,
            isActive: true,
        });

        await this.serviceRepository.add(service);
    }
}