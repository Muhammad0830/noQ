import { GetServiceDataQueryInterface, ServiceDetailsDTO } from "@/application/service/interfaces/GetServiceDataQueryInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export class GetServiceDetailsUseCase {
    constructor(
        private readonly getServiceDataQuery: GetServiceDataQueryInterface,
    ) { }

    async execute(id: string): Promise<ServiceDetailsDTO> {
        const serviceId = ServiceId.create(id);

        const service = await this.getServiceDataQuery.getDetails(serviceId);

        if (!service.isActive) {
            throw new Error("Users have no access to inactive services");
        }

        return service;
    }
}