import { API_ENDPOINTS } from "@/lib/api";
import { useApiMutation } from "../useApiMutation";
import useApiQuery from "../useApiQuery";
import { ApiResponse, DashboardBaseInfoResponse, DashboardBookingsResponse, defaultDashBoardBaseInfoResponse, startOfDay } from "@noq/shared";
import { AxiosError } from "axios";
import { UseMutateFunction } from "@tanstack/react-query";

export interface UseAdminDashboardProps {
    shopId: string;
    date: Date;
}

export interface UseAdminDashboardType {
    baseInfo: DashboardBaseInfoResponse;
    baseInfoError: AxiosError | null;
    isBaseInfoError: boolean;
    isBaseInfoLoading: boolean;

    bookings: DashboardBookingsResponse;
    bookingsError: AxiosError | null;
    isBookingsLoading: boolean;
    isBookingError: boolean;
    refetchBookings: () => void;

    completeBooking: UseMutateFunction<ApiResponse<null>, Error, {
        bookingId: string;
    }, unknown>
    cancelBooking: UseMutateFunction<ApiResponse<null>, Error, {
        bookingId: string;
        reason: string;
    }, unknown>
    confirmBooking: UseMutateFunction<ApiResponse<null>, Error, {
        bookingId: string;
    }, unknown>
    startBooking: UseMutateFunction<ApiResponse<null>, Error, {
        bookingId: string;
    }, unknown>

    isCompleting: boolean;
    isCancelling: boolean;
    isConfirming: boolean;
    isStarting: boolean;
}

export function useAdminDashboard({
    shopId,
    date,
}: UseAdminDashboardProps): UseAdminDashboardType {
    const {
        data: baseInfo = defaultDashBoardBaseInfoResponse,
        error: baseInfoError,
        isError: isBaseInfoError,
        isLoading: isBaseInfoLoading,
    } = useApiQuery<DashboardBaseInfoResponse>(
        `${API_ENDPOINTS.admin.dashboardBaseInfo}`,
        {
            key: ["admin-dashboard-base-info", `${shopId}`],
            enabled: !!shopId,
            staleTime: 30_000,
            headers: { "x-shop-id": shopId }
        });

    const {
        data: bookings = { data: [] },
        isLoading: isBookingsLoading,
        error: bookingsError,
        isError: isBookingError,
        refetch: refetchBookings,
    } = useApiQuery<DashboardBookingsResponse>(
        `${API_ENDPOINTS.admin.dashboardBookings}?date=${startOfDay(date).toISOString()}`,
        {
            key: ["admin-dashboard-bookings", `${date}`, `${shopId}`],
            enabled: !!shopId,
            staleTime: 15_000,
            headers: { "x-shop-id": shopId ?? '' },
        },
    );

    const { mutate: completeBooking, isPending: isCompleting } =
        useApiMutation<null, { bookingId: string }>(
            ({ bookingId }) => API_ENDPOINTS.admin.bookingComplete(bookingId),
            "put",
            () => ({ headers: { "x-shop-id": shopId ?? 'no-shop-id' } }),
        );

    const { mutate: cancelBooking, isPending: isCancelling } =
        useApiMutation<null, { bookingId: string, reason: string }>(
            ({ bookingId }) => API_ENDPOINTS.admin.bookingCancel(bookingId),
            "put",
            () => ({ headers: { "x-shop-id": shopId ?? 'no-shop-id' } }),
        );

    const { mutate: startBooking, isPending: isStarting } =
        useApiMutation<null, { bookingId: string }>(
            ({ bookingId }) => API_ENDPOINTS.admin.bookingStart(bookingId),
            "put",
            () => ({ headers: { "x-shop-id": shopId ?? 'no-shop-id' } }),
        );

    const { mutate: confirmBooking, isPending: isConfirming } =
        useApiMutation<null, { bookingId: string }>(
            ({ bookingId }) => API_ENDPOINTS.admin.bookingConfirm(bookingId),
            "put",
            () => ({ headers: { "x-shop-id": shopId ?? 'no-shop-id' } }),
        );


    return {
        baseInfo,
        baseInfoError,
        isBaseInfoError,
        isBaseInfoLoading,

        bookings,
        bookingsError,
        isBookingsLoading,
        isBookingError,
        refetchBookings,

        completeBooking,
        cancelBooking,
        confirmBooking,
        startBooking,

        isCompleting,
        isCancelling,
        isConfirming,
        isStarting,
    }
}