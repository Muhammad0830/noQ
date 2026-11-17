import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { GetBookingDataQueryInterface, GetListByDateTimeOutput } from "../interfaces/GetBookingDataQueryInterface.js";
import { GetBookingListByDateTimeUseCaseInput, GetBookingListByDateTimeUseCaseInterface } from "../interfaces/GetBookingListByDateTimeUseCaseInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetBookingListByDateTimeUseCase implements GetBookingListByDateTimeUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetBookingListByDateTimeUseCaseInput): Promise<GetListByDateTimeOutput> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = startTime.addDays(1);

        return await this.getBookingDataQuery.getListByDateTime({
            shopId,
            startTime,
            endTime,
        });
    }
}