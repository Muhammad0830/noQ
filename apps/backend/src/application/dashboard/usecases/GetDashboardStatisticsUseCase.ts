import {
    DashboardStatisticsDTO,
    GetDashboardStatisticsUseCaseInterface
} from "../interfaces/GetDashboardStatisticsUseCaseInterface.js";
import { GetBookingDataQueryInterface } from
    "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { GetStaffDataQueryInterface } from
    "@/application/staff/interfaces/GetStaffDataQueryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class GetDashboardStatisticsUseCase implements GetDashboardStatisticsUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
        private readonly getStaffDataQuery: GetStaffDataQueryInterface,
    ) { }

    async execute(id: string): Promise<DashboardStatisticsDTO> {
        const shopId = ShopId.create(id);

        await this.shopRepository.ensureExists(shopId);

        const now = DateTime.now();
        const sevenDaysAgo = now.subtractDays(7);
        const previousSevenDaysAgo = sevenDaysAgo.subtractDays(7);

        const lastWeekBookingCount = await this.getBookingDataQuery.getCountByTime({
            shopId: shopId,
            startTime: sevenDaysAgo,
            endTime: now
        });

        const previousWeekBookingCount = await this.getBookingDataQuery.getCountByTime({
            shopId: shopId,
            startTime: previousSevenDaysAgo,
            endTime: sevenDaysAgo,
        });

        const staffCount = await this.getStaffDataQuery.getCountByShopId(shopId);

        const lastWeekBookingPriceList = await this.getBookingDataQuery.getPriceListByTime({
            shopId: shopId,
            startTime: sevenDaysAgo,
            endTime: now,
        });

        const previousWeekBookingPriceList = await this.getBookingDataQuery.getPriceListByTime({
            shopId: shopId,
            startTime: previousSevenDaysAgo,
            endTime: sevenDaysAgo
        });

        const currentRevenue = lastWeekBookingPriceList.reduce(
            (acc: number, price) => acc + price, 0
        );

        const prevRevenue = previousWeekBookingPriceList.reduce(
            (acc: number, price) => acc + price, 0
        );

        let lastWeekRevenueChange = 0;
        let lastWeekBookingCountChange = 0;

        if (prevRevenue === 0) {
            lastWeekRevenueChange = currentRevenue > 0 ? 100 : 0;
        } else {
            lastWeekRevenueChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
        }

        if (previousWeekBookingCount) {
            lastWeekBookingCountChange = ((lastWeekBookingCount - previousWeekBookingCount)
                / previousWeekBookingCount) * 100;
        } else {
            lastWeekBookingCountChange = lastWeekBookingCount > 0 ? 100 : 0
        }

        return {
            staffCount: staffCount,
            revenue: currentRevenue,
            bookingCount: lastWeekBookingCount,
            lastWeekRevenueChange: lastWeekRevenueChange,
            lastWeekBookingCountChange: lastWeekBookingCountChange,
        }
    }
} 