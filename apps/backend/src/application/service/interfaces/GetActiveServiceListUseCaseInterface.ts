import { ServiceDetailsDTO } from "./GetServiceDataQueryInterface.js";

export interface GetActiveServiceListUseCaseInterface {
    execute(shopId: string): Promise<ServiceDetailsDTO[]>;
}