import {
    GetPeakHourListUseCaseInput,
    GetPeakHourListUseCaseInterface,
    PeakHourItem
} from "../interfaces/GetPeakHourListUseCaseInterface.js";
import { GetBookingDataQueryInterface } from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetPeakHourListUseCase implements GetPeakHourListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetPeakHourListUseCaseInput): Promise<PeakHourItem[]> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);

        const peakHourList = await this.getBookingDataQuery.getPeakHourList({
            shopId: shopId,
            startTime: startTime,
            endTime: endTime,
        });

        const hoursMap = new Map<number, number>();

        for (let hour = 0; hour < 24; hour++) {
            hoursMap.set(hour, 0);
        }

        for (const item of peakHourList) {
            hoursMap.set(item.hour, item.count);
        }

        return Array.from(hoursMap, ([hour, count]) => ({
            hour: `${hour.toString().padStart(2, "0")}:00`,
            count,
        }));
    }
}