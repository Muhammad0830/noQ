export interface GetRevenueBaseInfoUseCaseInterface {
    execute(input: GetRevenueBaseInfoInput): Promise<RevenueBaseInfoDTO>
}

export interface GetRevenueBaseInfoInput {
    shopId: string;
    startTime: string;
    endTime: string;
}

export interface RevenueBaseInfoDTO {
    revenue: number;
    bookingCount: number;
    lastWeekRevenueChange: number;
    lastWeekBookingCountChange: number;
    averageRating: number;
    lastWeekAverageRatingChange: number;
}