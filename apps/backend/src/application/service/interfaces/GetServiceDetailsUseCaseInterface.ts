import { ServiceDetailsDTO } from "@/application/service/interfaces/GetServiceDataQueryInterface.js";

export interface GetServiceDetailsUseCaseInterface {
    execute(serviceId: string): Promise<ServiceDetailsDTO>;
}