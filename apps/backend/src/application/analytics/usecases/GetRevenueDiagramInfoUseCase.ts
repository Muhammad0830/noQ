import {
    addDays,
    addMonths,
    addYears,
    startOfDay,
    startOfMonth,
    startOfYear
} from "@noq/shared";
import {
    DiagramInterval,
    GetRevenueDiagramInfoUseCaseInterface,
    RevenueDiagramDTO,
    RevenueDiagramInput,
    RevenueDiagramItem
} from "../interfaces/GetRevenueDiagramInfoUseCaseInterface.js";
import { GetBookingDataQueryInterface } from
    "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class GetRevenueDiagramInfoUseCase implements GetRevenueDiagramInfoUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: RevenueDiagramInput): Promise<RevenueDiagramDTO> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);

        const bookingsData = await this.getBookingDataQuery.getRevenueByTime({
            shopId: shopId,
            startTime: startTime,
            endTime: endTime,
        })

        const revenueMap = new Map<string, number>();

        for (const booking of bookingsData.bookings) {
            const bucket = this.getBucketDate(
                booking.startTime,
                input.interval
            );

            const key = this.formatBucket(bucket, input.interval);

            const revenue = Number(booking.servicePrice);

            revenueMap.set(
                key,
                (revenueMap.get(key) ?? 0) + revenue
            );
        }

        const data: RevenueDiagramItem[] = [];

        let current = this.getBucketDate(startTime, input.interval);

        const last = this.getBucketDate(
            DateTime.from(endTime.getTime() - 1),
            input.interval
        );

        while (current.getTime() <= last.getTime()) {
            const key = this.formatBucket(current, input.interval);

            data.push({
                date: key,
                revenue: revenueMap.get(key) ?? 0,
            });

            current = this.getNextBucket(current, input.interval);
        }

        return { data };
    }

    private getBucketDate(
        date: DateTime,
        interval: DiagramInterval
    ): DateTime {
        switch (interval) {
            case "day":
                return DateTime.from(startOfDay(date.getValue()));

            case "month":
                return DateTime.from(startOfMonth(date.getValue()));

            case "year":
                return DateTime.from(startOfYear(date.getValue()));
        }
    }

    private getNextBucket(
        date: DateTime,
        interval: DiagramInterval
    ): DateTime {
        switch (interval) {
            case "day":
                return DateTime.from(addDays(date.getValue(), 1));

            case "month":
                return DateTime.from(addMonths(date.getValue(), 1));

            case "year":
                return DateTime.from(addYears(date.getValue(), 1));
        }
    }

    private formatBucket(
        date: DateTime,
        interval: DiagramInterval
    ): string {
        switch (interval) {
            case "day":
                return date.toISOString().slice(0, 10);

            case "month":
                return date.toISOString().slice(0, 7);

            case "year":
                return date.getUTCFullYear().toString();
        }
    }
}
