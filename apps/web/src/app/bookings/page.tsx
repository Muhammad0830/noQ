"use client";

import { useEffect, useState } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import BookingFilterTabs from "./components/BookingFilterTabs";
import HistoryPanel from "./components/HistoryPanel";
import OngoingPanel from "./components/OngoingPanel";
import { buildHistoryCard, buildOngoingCard } from "./bookings.utils";
import {
  ActiveBookingsResponse,
  BookingFilter,
  HistoryBookingsResponse,
} from "./bookings.types";

export default function MyBookings() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<BookingFilter>("ongoing");
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getStoredAuth()?.token));
    setIsHydrated(true);
  }, []);

  const {
    data: activeBookingsData,
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
    refetch: refetchActive,
  } = useApiQuery<ActiveBookingsResponse>(API_ENDPOINTS.bookingsByUser.active, {
    key: ["bookings", "users", "active"],
    enabled: isHydrated && filter === "ongoing" && hasToken,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
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
      key: ["bookings", "users", "history"],
      enabled: isHydrated && filter !== "ongoing" && hasToken,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    },
  );

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

  const completedHistory = (historyBookingsData?.completed || []).map((item) =>
    buildHistoryCard(item, "completed"),
  );
  const cancelledHistory = (historyBookingsData?.cancelled || []).map((item) =>
    buildHistoryCard(item, "cancelled"),
  );

  const filteredHistory =
    filter === "completed"
      ? completedHistory
      : filter === "cancelled"
        ? cancelledHistory
        : [];

  const activeErrorMessage = activeError?.data?.message || activeError?.message;
  const historyErrorMessage =
    historyError?.data?.message || historyError?.message;

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-5 text-slate-900 dark:bg-[#02060d] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <BookingFilterTabs filter={filter} onChange={setFilter} t={t} />

        <div
          className={`grid grid-cols-1 gap-6 ${
            filter === "ongoing"
              ? "xl:grid-cols-1"
              : "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          }`}
        >
          <div>
            {updatedActiveBookings.map((b, index) => (
              <div key={index}>
                <OngoingPanel
                  filter={filter}
                  isHydrated={isHydrated}
                  isLoading={isActiveLoading}
                  isError={isActiveError}
                  errorMessage={activeErrorMessage}
                  activeBooking={b}
                  onRetry={refetchActive}
                  t={t}
                />
              </div>
            ))}
          </div>

          <HistoryPanel
            filter={filter}
            isHydrated={isHydrated}
            isLoading={isHistoryLoading}
            isError={isHistoryError}
            errorMessage={historyErrorMessage}
            bookings={filteredHistory}
            onRetry={refetchHistory}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
