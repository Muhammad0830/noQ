export interface DashboardBaseInfoResponse {
    revenue: number;
    bookingCount: number;
    lastWeekRevenueChange: number;
    lastWeekBookingCountChange: number;
    staffCount: number;
};

export const defaultDashBoardBaseInfoResponse: DashboardBaseInfoResponse = {
    revenue: 0,
    bookingCount: 0,
    lastWeekRevenueChange: 0,
    lastWeekBookingCountChange: 0,
    staffCount: 0,
}