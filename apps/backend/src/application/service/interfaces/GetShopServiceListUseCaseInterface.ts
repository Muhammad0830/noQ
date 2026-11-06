import { ServiceDetailsDTO } from "./GetServiceDataQueryInterface.js";

export interface GetShopServiceListUseCaseInterface {
    execute(shopId: string): Promise<ServiceDetailsDTO[]>
}