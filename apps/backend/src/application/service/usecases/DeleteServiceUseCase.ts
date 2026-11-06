import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { DeleteServiceUseCaseInterface } from "../interfaces/DeleteServiceUseCaseInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export class DeleteServiceUseCase implements DeleteServiceUseCaseInterface {
    constructor(
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) { }

    async execute(id: string): Promise<void> {
        const serviceId = ServiceId.create(id);

        await this.serviceRepository.ensureExists(serviceId);

        await this.serviceRepository.delete(serviceId);
    }
}