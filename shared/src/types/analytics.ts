export type AnalyticsType = "week" | "month" | "year";

export type AnalyticsSummaryResponse = {
    revenue: number;
    bookingCount: number;
    averageRating: number;
    lastWeekRevenueChange: number;
    lastWeekBookingCountChange: number;
    lastWeekAverageRatingChange: number;
};

export type DiagramInfoResponse = {
    data: DiagramInfoItem[];
};

export interface DiagramInfoItem {
    date: string;
    revenue: number;
}

export type FamousServiceItem = {
    id: string;
    name: string;
    bookingCount: number;
    averageRating: number;
};

export type PeakHour = {
    hour: string;
    count: number;
}

export enum IntervalEnum {
    DAY = "day",
    MONTH = "month",
    YEAR = "year",
}

export type IntervalType = "day" | "month" | "year";
