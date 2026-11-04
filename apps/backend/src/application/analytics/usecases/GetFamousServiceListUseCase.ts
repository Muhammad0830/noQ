import { GetBookingDataQueryInterface } from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { FamousServiceItem, GetFamousServiceListInput, GetFamousServiceListUseCaseInterface } from "../interfaces/GetFamousServiceListUseCaseInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetFamousServiceListUseCase implements GetFamousServiceListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetFamousServiceListInput): Promise<FamousServiceItem[]> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);

        const serviceList = await this.getBookingDataQuery.getFamousServiceList({
            shopId: shopId,
            startTime: startTime,
            endTime: endTime,
        });

        return serviceList;
    }
}