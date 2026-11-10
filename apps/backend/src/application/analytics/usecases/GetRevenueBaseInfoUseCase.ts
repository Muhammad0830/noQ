import {
    GetRevenueBaseInfoInput,
    GetRevenueBaseInfoUseCaseInterface,
    RevenueBaseInfoDTO
} from "../interfaces/GetRevenueBaseInfoUseCaseInterface.js";
import { GetBookingDataQueryInterface } from
    "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { PrismaShopRepository } from
    "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { GetReviewDataQueryInterface } from
    "@/application/review/interfaces/GetReviewDataQueryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetRevenueBaseInfoUseCase implements GetRevenueBaseInfoUseCaseInterface {
    constructor(
        private readonly shopRepository: PrismaShopRepository,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
        private readonly getReviewDataQuery: GetReviewDataQueryInterface,
    ) { }

    async execute(input: GetRevenueBaseInfoInput): Promise<RevenueBaseInfoDTO> {
        const shopId = ShopId.create(input.shopId);

        await this.shopRepository.ensureExists(shopId);

        const startTime = DateTime.from(input.startTime);
        const endTime = DateTime.from(input.endTime);
        const durationDifference = DateTime.diffInMilliseconds(endTime, startTime);
        const prevStartTime = startTime.subtractMilliseconds(durationDifference);

        const [
            priceList,
            previousPriceList,
            averageRating,
            previousAverageRating
        ] = await Promise.all([
            this.getBookingDataQuery.getPriceListByTime({
                shopId: shopId,
                startTime: startTime,
                endTime: endTime,
            }),

            this.getBookingDataQuery.getPriceListByTime({
                shopId: shopId,
                startTime: prevStartTime,
                endTime: startTime,
            }),

            this.getReviewDataQuery.getAverageByTime({
                shopId: shopId,
                endTime: endTime,
            }),

            this.getReviewDataQuery.getAverageByTime({
                shopId: shopId,
                endTime: startTime,
            })
        ]);

        const revenue = priceList.reduce((acc, price) => acc + price, 0);
        const prevRevenue = previousPriceList.reduce((acc, price) => acc + price, 0);

        let revenueChange = 0;
        let bookingCountChange = 0;

        if (prevRevenue === 0) {
            revenueChange = revenue > 0 ? 100 : 0;
        } else {
            revenueChange = ((revenue - prevRevenue) / prevRevenue) * 100;
        }

        if (previousPriceList.length === 0) {
            bookingCountChange = priceList.length > 0 ? 100 : 0
        } else {
            bookingCountChange = ((priceList.length - previousPriceList.length) / previousPriceList.length) * 100;
        }

        return {
            revenue: revenue,
            bookingCount: priceList.length,
            averageRating: averageRating,
            lastWeekRevenueChange: revenueChange,
            lastWeekBookingCountChange: bookingCountChange,
            lastWeekAverageRatingChange: averageRating - previousAverageRating
        }
    }
}