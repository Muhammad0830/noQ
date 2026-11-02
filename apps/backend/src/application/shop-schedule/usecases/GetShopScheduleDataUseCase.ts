import { GetShopScheduleDataUseCaseInterface } from "../interfaces/GetShopScheduleDataUseCaseInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { GetShopScheduleDataQueryInterface, ShopScheduleDTO } from "../interfaces/GetShopScheduleDataQueryInterface.js";

export class GetShopScheduleDataUseCase implements GetShopScheduleDataUseCaseInterface {
    constructor(
        private readonly getShopScheduleDataQuery: GetShopScheduleDataQueryInterface,
        private readonly shopRepository: ShopRepositoryInterface,
    ) { }

    async execute(id: string): Promise<ShopScheduleDTO> {
        const shopId = ShopId.create(id);

        await this.shopRepository.ensureExists(shopId);

        return await this.getShopScheduleDataQuery.getWeekly(shopId);
    }
}