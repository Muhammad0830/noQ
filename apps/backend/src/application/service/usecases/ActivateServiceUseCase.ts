import { ServiceRepositoryInterface } from
    "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ActivateServiceUseCaseInterface } from
    "../interfaces/ActivateServiceUseCaseInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export class ActivateServiceUseCase implements ActivateServiceUseCaseInterface {
    constructor(
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) { }

    async execute(id: string): Promise<void> {
        const serviceId = ServiceId.create(id);

        const service = await this.serviceRepository.findById(serviceId);

        service.activate();

        await this.serviceRepository.save(service);
    }
}