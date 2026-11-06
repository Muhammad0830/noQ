import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { UpdateServiceUseCaseInput, UpdateServiceUseCaseInterface } from "../interfaces/UpdateServiceUseCaseInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { Money } from "@/domain/shared/value-objects/Money.js";

export class UpdateServiceUseCase implements UpdateServiceUseCaseInterface {
    constructor(
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) {}

    async execute(input: UpdateServiceUseCaseInput): Promise<void> {
        const serviceId = ServiceId.create(input.id);

        const service = await this.serviceRepository.findById(serviceId);

        service.updateName(input.name);
        service.updateDescription(input.description);
        service.updatePrice(Money.fromAmount(input.price, "UZS"));
        service.updateDurationMin(input.durationMin);
        service.updateBufferTime(input.bufferTime);

        await this.serviceRepository.save(service);
    }
}