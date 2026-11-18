import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetServiceDataQueryInterface, ServiceDetailsDTO } from "../interfaces/GetServiceDataQueryInterface.js";
import { GetActiveServiceListUseCaseInterface } from "../interfaces/GetActiveServiceListUseCaseInterface.js";

export class GetActiveServiceListUseCase implements GetActiveServiceListUseCaseInterface {
    constructor(
        private getServiceDataQuery: GetServiceDataQueryInterface,
    ) { }

    async execute(id: string): Promise<ServiceDetailsDTO[]> {
        const shopId = ShopId.create(id);

        return await this.getServiceDataQuery.getActiveByShopId(shopId);
    }
}