import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetServiceDataQueryInterface, ServiceDetailsDTO } from "../interfaces/GetServiceDataQueryInterface.js";
import { GetShopServiceListUseCaseInterface } from "../interfaces/GetShopServiceListUseCaseInterface.js";

export class GetShopServiceListUseCase implements GetShopServiceListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getServiceDataQuery: GetServiceDataQueryInterface,
    ) { }

    async execute(id: string): Promise<ServiceDetailsDTO[]> {
        const shopId = ShopId.create(id);

        await this.shopRepository.ensureExists(shopId);

        return await this.getServiceDataQuery.getByShopId(shopId);
    }
}