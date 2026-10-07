"use client";

import { useEffect, useState } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import BookingTabs from "@/features/booking/components/BookingTabs";
import HistoryPanel from "@/features/booking/components/HistoryPanel";
import OngoingPanel from "@/features/booking/components/OngoingPanel";
import { buildHistoryCard, buildOngoingCard } from "@/features/booking/utils";
import {
  ActiveBookingsResponse,
  BookingTabs as BookingTabsType,
  HistoryBookingsResponse,
} from "@/features/booking/types";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function MyBookings() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState<BookingTabsType>("ongoing");

  useEffect(() => {
    if(!isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router])

  const {
    data: activeBookingsData,
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
  } = useApiQuery<ActiveBookingsResponse>(API_ENDPOINTS.bookingsByUser.active, {
    key: ["bookings", "users", "active"],
    staleTime: 1 * 60 * 1000 // 1 minute,
  });

  const {
    data: historyBookingsData,
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    error: historyError,
    refetch: refetchHistory,
  } = useApiQuery<HistoryBookingsResponse>(
    API_ENDPOINTS.bookingsByUser.history,
    {
      key: ["bookings", "history"],
      enabled: selectedTab !== "ongoing",
      staleTime: 1 * 60 * 1000 // 1 minute,
    },
  );

  const { mutateAsync: cancelBooking, isPending: isCancellingBooking } =
    useApiMutation<unknown, { bookingId: string }>(
      ({ bookingId }) => API_ENDPOINTS.bookingCancel(bookingId),
      "put",
    );

  const handleCancelBooking = async (bookingId?: string) => {
    if (!bookingId) {
      return;
    }

    const shouldCancel = window.confirm(
      t("user.booking.cancel_confirm") || "Bookingni bekor qilasizmi?",
    );
    if (!shouldCancel) {
      return;
    }

    try {
      await cancelBooking({ bookingId });
      await Promise.all([refetchHistory()]);
    } catch (cancelError) {
      console.error("Cancel booking failed", cancelError);
      alert(
        t("user.booking.cancel_error")
      );
    }
  };

  const activeBookings = [
    ...(activeBookingsData?.pending || []),
    ...(activeBookingsData?.confirmed || []),
    ...(activeBookingsData?.inProgress || []),
  ].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const updatedActiveBookings = activeBookings.map((b) =>
    b ? buildOngoingCard(b) : null,
  );
  const ongoingCardsToRender =
    updatedActiveBookings.length > 0 ? updatedActiveBookings : [null];

  const completedHistory = (historyBookingsData?.completed || []).map((item) =>
    buildHistoryCard(item, "completed"),
  );
  const cancelledHistory = (historyBookingsData?.cancelled || []).map((item) =>
    buildHistoryCard(item, "cancelled"),
  );

  const filteredHistory =
    selectedTab === "completed"
      ? completedHistory
      : selectedTab === "cancelled"
        ? cancelledHistory
        : [];

  const activeErrorMessage = activeError?.data?.message || activeError?.message;
  const historyErrorMessage =
    historyError?.data?.message || historyError?.message;

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <BookingTabs tabsKey={selectedTab} onChange={setSelectedTab} />

        <div
          className={`grid grid-cols-1 ${selectedTab === "ongoing"
            ? "xl:grid-cols-1"
            : "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
            }`}
        >
          <div className="space-y-4">
            {ongoingCardsToRender.map((b, index) => (
              <div key={index}>
                <OngoingPanel
                  filter={selectedTab}
                  showHeader={index === 0}
                  isLoading={isActiveLoading}
                  isError={isActiveError}
                  errorMessage={activeErrorMessage}
                  activeBooking={b}
                  onCancelBooking={handleCancelBooking}
                  isCancellingBooking={isCancellingBooking}
                  t={t}
                />
              </div>
            ))}
          </div>

          <HistoryPanel
            filter={selectedTab}
            isLoading={isHistoryLoading}
            isError={isHistoryError}
            errorMessage={historyErrorMessage}
            bookings={filteredHistory}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
