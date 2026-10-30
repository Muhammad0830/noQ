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
  BookingTabs as BookingTabsType,
} from "@/features/booking/types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import BookingCancelConfirmDialog from "@/features/booking/components/BookingCancelConfirmDialog";
import BookingPanelTitle from "@/features/booking/components/BookingPanelTitle";
import { STATUS_ICONS, STATUS_LABELS } from "@/features/booking/components/booking-status";
import { BookingItem, BookingStatus, CancelBookingRequestBody } from "@noq/shared";

export default function MyBookings() {
  const { isAuthenticated, isLoading, user } = useAuth()
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
    data: activeBookingsData = [],
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
    refetch: refetchActive
  } = useApiQuery<BookingItem[]>(API_ENDPOINTS.bookingsByUser.active, {
    key: ["bookings", "users", "active"],
    staleTime: 1 * 60 * 1000 // 1 minute,
  });

  const {
    data: completedData = [],
    isLoading: isCompletedLoading,
    isError: isCompletedError,
    error: completedError,
  } = useApiQuery<BookingItem[]>(
    API_ENDPOINTS.bookingsByUser.completed,
    { key: ["bookings", "completed"], staleTime: 1 * 60 * 1000 }, // 1 minute
  );

  const {
    data: cancelledData = [],
    isLoading: isCancelledLoading,
    isError: isCancelledError,
    error: cancelledError,
    refetch: refetchCancelled,
  } = useApiQuery<BookingItem[]>(
    API_ENDPOINTS.bookingsByUser.cancelled,
    { key: ["bookings", "cancelled"], staleTime: 1 * 60 * 1000 }, // 1 minute
  );

  const { mutateAsync: cancelBooking, isPending: isCancellingBooking } =
    useApiMutation<null, CancelBookingRequestBody>(
      (body) => API_ENDPOINTS.bookingCancel(body.id), "put"
    );

  const handleCancelBooking = async () => {
    if (!selectedBookingId || !user) {
      return;
    }

    try {
      await cancelBooking({ id: selectedBookingId, userId: user.id });
    } finally {
      await refetchCancelled();
      await refetchActive();
    }
  };

  const openConfirmDialog = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setIsOpen(true);
  }

  const activeBookings = activeBookingsData.sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  ).map((b) => buildInProgressCard(b));

  const completedHistory = completedData.map((item) =>
    buildHistoryCard(item),
  );
  const cancelledHistory = cancelledData.map((item) =>
    buildHistoryCard(item),
  );

  return (
    <div className="flex-1 bg-[#eef3f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
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

              <div className="space-y-4">
                <InProgressPanel
                  isLoading={isActiveLoading}
                  isError={isActiveError}
                  errorMessage={activeError?.response?.data?.message || activeError?.message}
                  bookings={activeBookings}
                  onCancelBooking={openConfirmDialog}
                  isCancellingBooking={isCancellingBooking} />
              </div>
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

              <div className="space-y-4">
                <HistoryPanel
                  isLoading={isCancelledLoading || isCompletedLoading}
                  isCancelledError={isCancelledError}
                  isCompletedError={isCompletedError}
                  cancelledDataErrorMessage={cancelledError?.response?.data?.message}
                  completedDataErrorMessage={completedError?.response?.data?.message}
                  bookings={selectedTab === BookingTabsType.COMPLETED
                    ? completedHistory : cancelledHistory}
                  selectedTab={selectedTab}
                />
              </div>
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
