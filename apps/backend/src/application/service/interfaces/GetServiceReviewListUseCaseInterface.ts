import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { ServiceWithReviewsDTO } from "./GetServiceDataQueryInterface.js";

export interface GetServiceReviewListUseCaseInterface {
    execute(serviceId: string): Promise<ServiceWithReviewsDTO>;
}