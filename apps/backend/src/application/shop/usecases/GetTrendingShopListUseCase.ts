import { GetTrendingShopListUseCaseInterface, GetTrendingShopListUseCaseOutput } from
    "@/application/shop/interfaces/GetTrendingShopListUseCaseInterface.js";
import { GetShopListQueryInterface } from "../interfaces/GetShopListQueryInterface.js";

const TIME_RANGE = 7 * 24 * 60 * 60 * 1000; // last 7 days

export class GetTrendingShopListUseCase implements GetTrendingShopListUseCaseInterface {
    constructor(
        private readonly getShopListQuery: GetShopListQueryInterface,
    ) { }

    async execute(): Promise<GetTrendingShopListUseCaseOutput> {
        return await this.getShopListQuery.getTrendingList(TIME_RANGE);
    }
}