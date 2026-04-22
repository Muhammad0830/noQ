"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, X } from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS, getStoredAuth } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
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
  const router = useRouter();
  const { t } = useLanguage();
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [filter, setFilter] = useState<BookingFilter>("ongoing");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasToken = isAuthenticated || Boolean(getStoredAuth()?.token);

  useEffect(() => {
    if (!isHydrated) return;
    setIsAuthPromptOpen(!hasToken && !isAuthLoading);
  }, [hasToken, isAuthLoading, isHydrated]);

  const {
    data: activeBookingsData,
    isLoading: isActiveLoading,
    isError: isActiveError,
    error: activeError,
    refetch: refetchActive,
  } = useApiQuery<ActiveBookingsResponse>(API_ENDPOINTS.bookingsByUser.active, {
    key: ["bookings", "users", "active"],
    enabled: isHydrated && !isAuthLoading && filter === "ongoing" && hasToken,
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
      enabled: isHydrated && !isAuthLoading && filter !== "ongoing" && hasToken,
      staleTime: 0,
      refetchOnMount: "always",
      refetchOnWindowFocus: true,
    },
  );

  useEffect(() => {
    if (!isHydrated) return;

    const unauthorized =
      activeError?.status === 401 || historyError?.status === 401;

    if (unauthorized) {
      logout();
      setIsAuthPromptOpen(true);
    }
  }, [activeError?.status, historyError?.status, isHydrated, logout]);

  const handleRetryActive = () => {
    if (!hasToken) {
      setIsAuthPromptOpen(true);
      return;
    }

    refetchActive();
  };

  const handleRetryHistory = () => {
    if (!hasToken) {
      setIsAuthPromptOpen(true);
      return;
    }

    refetchHistory();
  };

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
      t("history.cancelConfirm") || "Bookingni bekor qilasizmi?",
    );
    if (!shouldCancel) {
      return;
    }

    try {
      await cancelBooking({ bookingId });
      await Promise.all([refetchActive(), refetchHistory()]);
    } catch (cancelError) {
      console.error("Cancel booking failed", cancelError);
      alert(
        t("history.cancelError") ||
          "Bookingni bekor qilishda xatolik yuz berdi",
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
    filter === "completed"
      ? completedHistory
      : filter === "cancelled"
        ? cancelledHistory
        : [];

  const activeErrorMessage = activeError?.data?.message || activeError?.message;
  const historyErrorMessage =
    historyError?.data?.message || historyError?.message;

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-5 text-slate-900 dark:bg-[#211201] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <BookingFilterTabs filter={filter} onChange={setFilter} t={t} />

        <div
          className={`grid grid-cols-1 gap-6 ${
            filter === "ongoing"
              ? "xl:grid-cols-1"
              : "xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
          }`}
        >
          <div className="space-y-4">
            {ongoingCardsToRender.map((b, index) => (
              <div key={index}>
                <OngoingPanel
                  filter={filter}
                  showHeader={index === 0}
                  isHydrated={isHydrated}
                  isLoading={isActiveLoading}
                  isError={isActiveError}
                  errorMessage={activeErrorMessage}
                  activeBooking={b}
                  onRetry={handleRetryActive}
                  onCancelBooking={handleCancelBooking}
                  isCancellingBooking={isCancellingBooking}
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
            onRetry={handleRetryHistory}
            t={t}
          />
        </div>
      </div>

      {isHydrated && !hasToken && isAuthPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 dark:bg-black/65">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-[#211201] sm:p-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="pr-8 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl">
              {t("history.authRequiredTitle")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("history.authRequiredMessage")}
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 px-4 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <LogIn className="h-4 w-4" />
              {t("history.authRequiredAction")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
