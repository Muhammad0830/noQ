import { API_ENDPOINTS } from "@/lib/api";
import useApiQuery from "../useApiQuery";
import { AnalyticsSummaryResponse, DiagramInfoResponse, FamousServiceItem, IntervalType, PeakHour } from "@noq/shared";
import { AxiosError } from "axios";

interface Props {
    shopId: string | undefined;
    startTime: Date;
    endTime: Date;
    interval: IntervalType;
}

interface UseAdminAnalyitcsType {
    analyticsSummary: AnalyticsSummaryResponse,
    isSummaryLoading: boolean,
    isSummaryError: boolean,
    summaryError: AxiosError | null,

    diagramInfo: DiagramInfoResponse,
    isDiagramLoading: boolean,
    isDiagramError: boolean,
    diagramError: AxiosError | null,

    famousServices: FamousServiceItem[],
    isServicesLoading: boolean,
    isServicesError: boolean,
    servicesError: AxiosError | null,

    peakHours: PeakHour[],
    isPeakHoursLoading: boolean,
    isPeakHoursError: boolean,
    peakHoursError: AxiosError | null,
}

const defaultAnalyticsSummary = {
    revenue: 0,
    bookingCount: 0,
    averageRating: 0,
    lastWeekRevenueChange: 0,
    lastWeekBookingCountChange: 0,
    lastWeekAverageRatingChange: 0,
}

export const useAdminAnalytics = ({
    shopId,
    startTime,
    endTime,
    interval,
}: Props): UseAdminAnalyitcsType => {
    const analyticsHeaders = { "x-shop-id": shopId ?? '' };
    const timeQuery = `startTime=${startTime.toISOString()}&endTime=${endTime.toISOString()}`;

    const {
        data: analyticsSummary = defaultAnalyticsSummary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
        error: summaryError,
    } = useApiQuery<AnalyticsSummaryResponse>(
        `${API_ENDPOINTS.admin.analyticsBaseInfo}?${timeQuery}`,
        {
            key: ["admin-analytics-summary", `${shopId}`, `${startTime}`, `${endTime}`],
            enabled: !!(shopId),
            staleTime: 30_000,
            headers: analyticsHeaders,
        },
    );

    const {
        data: diagramInfo = { data: [] },
        isLoading: isDiagramLoading,
        isError: isDiagramError,
        error: diagramError,
    } = useApiQuery<DiagramInfoResponse>(
        `${API_ENDPOINTS.admin.analyticsDiagramInfo}?${timeQuery}&interval=${interval}`,
        {
            enabled: !!(shopId),
            staleTime: 30_000,
            headers: analyticsHeaders,
            key: [
                "admin-analytics-diagram",
                `${shopId}`,
                `${startTime}`,
                `${endTime}`,
                interval
            ],
        },
    );

    const {
        data: famousServices = [],
        isLoading: isServicesLoading,
        isError: isServicesError,
        error: servicesError,
    } = useApiQuery<FamousServiceItem[]>(
        `${API_ENDPOINTS.admin.analyticsFamousServices}?${timeQuery}`,
        {
            key: ["admin-analytics-services", `${shopId}`, `${startTime}`, `${endTime}`],
            enabled: !!(shopId),
            staleTime: 30_000,
            headers: analyticsHeaders,
        },
    );

    const {
        data: peakHours = [],
        isLoading: isPeakHoursLoading,
        isError: isPeakHoursError,
        error: peakHoursError,
    } = useApiQuery<PeakHour[]>(
        `${API_ENDPOINTS.admin.analyticsPeakHours}?${timeQuery}`,
        {
            key: ["admin-analytics-peak-hours", `${shopId}`, `${startTime}`, `${endTime}`],
            enabled: !!(shopId),
            staleTime: 30_000,
            headers: analyticsHeaders,
        },
    );

    return {
        analyticsSummary,
        isSummaryLoading,
        isSummaryError,
        summaryError,

        diagramInfo,
        isDiagramLoading,
        isDiagramError,
        diagramError,

        famousServices,
        isServicesLoading,
        isServicesError,
        servicesError,

        peakHours,
        isPeakHoursLoading,
        isPeakHoursError,
        peakHoursError,
    }
}