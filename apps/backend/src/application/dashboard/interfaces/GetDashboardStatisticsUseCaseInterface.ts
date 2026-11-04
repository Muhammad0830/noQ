import { Money } from "@/domain/shared/value-objects/Money.js";

export interface GetDashboardStatisticsUseCaseInterface {
    execute(shopId: string): Promise<DashboardStatisticsDTO>;
}

export interface DashboardStatisticsDTO {
    revenue: number;
    bookingCount: number;
    lastWeekRevenueChange: number;
    lastWeekBookingCountChange: number;
    staffCount: number;
}