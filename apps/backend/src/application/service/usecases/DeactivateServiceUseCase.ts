import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { DeactivateServiceUseCaseInterface } from "../interfaces/DeactivateServiceUseCaseInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export class DeactivateServiceUseCase implements DeactivateServiceUseCaseInterface {
    constructor(
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) {}

    async execute(id: string): Promise<void> {
        const serviceId = ServiceId.create(id);

        const service = await this.serviceRepository.findById(serviceId);

        service.deactivate();

        await this.serviceRepository.save(service);
    }
}