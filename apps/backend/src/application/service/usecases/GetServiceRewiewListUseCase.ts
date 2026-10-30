import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { GetServiceDataQueryInterface, ServiceWithReviewsDTO } from "../interfaces/GetServiceDataQueryInterface.js";
import { GetServiceReviewListUseCaseInterface } from "../interfaces/GetServiceReviewListUseCaseInterface.js";

export class GetServiceReviewListUseCase implements GetServiceReviewListUseCaseInterface {
    constructor(
        private readonly getServiceDataQuery: GetServiceDataQueryInterface,
    ) { }

    async execute(id: string): Promise<ServiceWithReviewsDTO> {
        const serviceId = ServiceId.create(id);

        const dto = await this.getServiceDataQuery.getServiceReviewList(serviceId);

        return dto;
    }
}