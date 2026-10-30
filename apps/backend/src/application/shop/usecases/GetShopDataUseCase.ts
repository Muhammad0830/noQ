import { GetShopDataUseCaseInterface } from "../interfaces/GetShopDataUseCaseInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetShopDataQuery } from "@/infrastructue/persistence/shop/GetShopDataQuery.js";
import { GetShopDataQueryOutput } from "../interfaces/GetShopDataQueryInterface.js";

export class GetShopDataUseCase implements GetShopDataUseCaseInterface {
    constructor(
        private readonly getShopDataQuery: GetShopDataQuery,
    ) { }

    async execute(id: string): Promise<GetShopDataQueryOutput> {
        const shopId = ShopId.create(id);

        const shop = await this.getShopDataQuery.execute(shopId);

        return shop;
    }
}