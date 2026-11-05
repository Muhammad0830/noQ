import {
    GetPeakHourListUseCaseInput,
    GetPeakHourListUseCaseInterface,
    PeakHourItem
} from "../interfaces/GetPeakHourListUseCaseInterface.js";
import { GetBookingDataQueryInterface } from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { getTimezoneOffset } from "@noq/shared";

export class GetPeakHourListUseCase implements GetPeakHourListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetPeakHourListUseCaseInput): Promise<PeakHourItem[]> {
        const shopId = ShopId.create(input.shopId);

        const shop = await this.shopRepository.findById(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);

        const peakHourList = await this.getBookingDataQuery.getPeakHourList({
            shopId: shopId,
            startTime: startTime,
            endTime: endTime,
        });

        return this.getPeakHoursInTimezone(peakHourList, shop.getTimezone())
    }

    private getPeakHoursInTimezone(
        peakHourList: Array<{ hour: number; count: number }>,
        timeZone: string,
    ) {
        const offsetMs = getTimezoneOffset(timeZone, new Date());

        const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));

        const localHoursMap = new Map<number, number>();
        for (let hour = 0; hour < 24; hour++) {
            localHoursMap.set(hour, 0);
        }

        for (const item of peakHourList) {
            const localHour = (item.hour + offsetHours + 24) % 24;
            localHoursMap.set(localHour, item.count);
        }

        return Array.from(localHoursMap, ([hour, count]) => ({
            hour: `${hour.toString().padStart(2, "0")}:00`,
            count,
        }));
    }
}