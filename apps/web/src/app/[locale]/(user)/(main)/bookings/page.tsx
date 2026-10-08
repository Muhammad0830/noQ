"use client";

import { useEffect, useState } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import BookingTabs from "@/features/booking/components/BookingTabs";
import HistoryPanel from "@/features/booking/components/HistoryPanel";
import InProgressPanel from "@/features/booking/components/InProgressPanel";
import { buildHistoryCard, buildInProgressCard } from "@/features/booking/utils";
import {
  ActiveBookingsResponse,
  BookingStatus,
  BookingTabs as BookingTabsType,
  HistoryBookingsResponse,
} from "@/features/booking/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import BookingCancelConfirmDialog from "@/features/booking/components/BookingCancelConfirmDialog";
import BookingPanelTitle from "@/features/booking/components/BookingPanelTitle";
import { STATUS_ICONS, STATUS_LABELS } from "@/features/booking/components/booking-status";

export default function MyBookings() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [selectedTab, setSelectedTab] = useState<BookingTabsType>(BookingTabsType.IN_PROGRESS);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router])

  const {
    data: activeBookingsData = { pending: [], confirmed: [], inProgress: [] },
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
  } = useApiQuery<ActiveBookingsResponse>(API_ENDPOINTS.bookingsByUser.active, {
    key: ["bookings", "users", "active"],
    staleTime: 1 * 60 * 1000 // 1 minute,
  });

  const {
    data: historyBookingsData = { completed: [], cancelled: [] },
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useApiQuery<HistoryBookingsResponse>(
    API_ENDPOINTS.bookingsByUser.history,
    {
      key: ["bookings", "history"],
      enabled: selectedTab !== BookingTabsType.IN_PROGRESS,
      staleTime: 1 * 60 * 1000 // 1 minute,
    },
  );

  const { mutateAsync: cancelBooking, isPending: isCancellingBooking } =
    useApiMutation<unknown, { bookingId: string }>(
      ({ bookingId }) => API_ENDPOINTS.bookingCancel(bookingId),
      "put",
    );

  const handleCancelBooking = async () => {
    if (!selectedBookingId) {
      return;
    }

    try {
      await cancelBooking({ bookingId: selectedBookingId });
    } catch (cancelError) {
      console.error("Cancel booking failed", cancelError);
    } finally {
      await refetchHistory()
    }
  };

  const openConfirmDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsOpen(true);
  }

  const activeBookings = [
    ...activeBookingsData.pending,
    ...activeBookingsData.confirmed,
    ...activeBookingsData.inProgress,
  ].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  ).map((b) => buildInProgressCard(b));

  const completedHistory = historyBookingsData.completed.map((item) =>
    buildHistoryCard(item),
  );
  const cancelledHistory = historyBookingsData.cancelled.map((item) =>
    buildHistoryCard(item),
  );

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <BookingTabs tabsKey={selectedTab} onChange={setSelectedTab} />

        <div
          className={cn("grid grid-cols-1", selectedTab === BookingTabsType.IN_PROGRESS
            ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]")}
        >
          {selectedTab === BookingTabsType.IN_PROGRESS ?
            <>
              <BookingPanelTitle
                title="user.history.nextAppointment"
                icon={<span className="h-1.5 w-1.5 rounded-full bg-blue-600" />}
                labelText={STATUS_LABELS[BookingStatus.IN_PROGRESS]}
                labelClassName="border-[#f49b33]/50 bg-[#f49b33]/20 text-[#f49b33]" />

              <InProgressPanel
                isLoading={isActiveLoading}
                isError={isActiveError}
                errorMessage={activeError?.response?.data?.message || activeError?.message}
                bookings={activeBookings}
                onCancelBooking={openConfirmDialog}
                isCancellingBooking={isCancellingBooking} />
            </>
            :
            <>
              <BookingPanelTitle
                title="user.history.recentHistory"
                icon={<span>{STATUS_ICONS[selectedTab]}</span>}
                labelText={STATUS_LABELS[selectedTab]}
                labelClassName={selectedTab === BookingTabsType.COMPLETED
                  ? "border-green-600/50 bg-green-600/10 text-green-600"
                  : "border-red-600/50 bg-red-600/10 text-red-600"} />

              <HistoryPanel
                isLoading={isHistoryLoading}
                isError={isHistoryError}
                errorMessage={historyError?.response?.data?.message || historyError?.message}
                bookings={selectedTab === BookingTabsType.COMPLETED
                  ? completedHistory : cancelledHistory} />
            </>
          }
        </div>
      </div>

      <BookingCancelConfirmDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onCancel={handleCancelBooking} />
    </div>
  );
}
