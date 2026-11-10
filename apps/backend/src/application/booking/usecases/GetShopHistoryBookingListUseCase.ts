import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import {
    GetBookingDataQueryInterface,
    GetShopHistoryBookingListOutput
} from "../interfaces/GetBookingDataQueryInterface.js";
import {
    GetShopHistoryBookingListUseCaseInput,
    GetShopHistoryBookingListUseCaseInterface
} from "../interfaces/GetShopHistoryBookingListUseCaseInterface.js";
import { ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetShopHistoryBookingListUseCase implements GetShopHistoryBookingListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetShopHistoryBookingListUseCaseInput): Promise<GetShopHistoryBookingListOutput> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);

        return await this.getBookingDataQuery.getShopHistoryBookingList({
            shopId: shopId,
            startTime: startTime,
            endTime: endTime,
            searchQuery: input.searchQuery,
        });
    }
}