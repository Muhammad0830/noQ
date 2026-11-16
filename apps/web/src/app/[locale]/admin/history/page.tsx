"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Share2,
  UserRound,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { useTranslations } from "next-intl";
import { BookingStatus, differenceInMilliseconds, formatToDateString, startOfDay } from "@noq/shared";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { useShop } from "@/contexts/ShopContext";
import HistoryBookingsSkeleton from "@/components/admin/history/HistoryBookingsSekeleton";
import { format } from "date-fns";
import { downloadCsv } from "@/services/downloadCsv";

type AdminHistoryBooking = {
  id: string;
  startTime: string;
  endTime: string;
  servicePrice: string;
  serviceName: string;
  status: BookingStatus
  createdAt: string;
  staffId: string | null;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  staff: {
    user: {
      id: string;
      name: string;
    };
  } | null;
}

type AdminHistoryBookingData = {
  data: AdminHistoryBooking[]
}



export default function Page() {
  const t = useTranslations();
  const { shop } = useShop();

  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  const {
    data: bookings = { data: [] },
    isLoading,
    isError,
    error,
  } = useApiQuery<AdminHistoryBookingData>(
    `${API_ENDPOINTS.admin.dashboardBookings}?date=${selectedDate.toISOString()}`,
    {
      key: ["admin-history", `${selectedDate}`],
      enabled: !!shop,
      staleTime: 60_000, // 1 minute
      headers: { "x-shop-id": shop?.id ?? "" }
    });

  const handleExport = () => {
    if (isExporting || bookings.data.length === 0) {
      return;
    }

    setExportDone(false);
    setIsExporting(true);

    const headers = [
      t("admin.history.startTime"),
      t("admin.history.endTime"),
      t("admin.history.customer"),
      t("admin.history.service"),
      t("admin.history.staff"),
      t("admin.history.status"),
      t("admin.history.price_sum"),
      t("admin.history.durationMin")
    ];

    const data = [...bookings.data.map((item) => {
      const diffMs = differenceInMilliseconds(item.endTime, item.startTime);

      return [
        format(item.startTime, 'yyyy-MM-dd HH:mm'),
        format(item.endTime, 'yyyy-MM-dd HH:mm'),
        item.customer.name.trim() ?? "",
        item.serviceName,
        item.staff?.user.name ?? '',
        statusLabels[item.status],
        item.servicePrice,
        `${diffMs / (60 * 1000)}`,
      ]
    })];

    downloadCsv({
      data: [headers, ...data],
      fileName: `shop-history-${formatToDateString(selectedDate)}.csv`
    })

    setIsExporting(false);
    setExportDone(true);

    window.setTimeout(() => {
      setExportDone(false);
    }, 500);
  };

  const statusLabels: Record<AdminHistoryBooking["status"], string> = {
    PENDING: t("booking_status.pending"),
    CONFIRMED: t("booking_status.confirmed"),
    IN_PROGRESS: t("booking_status.in_progress"),
    COMPLETED: t("booking_status.completed"),
    CANCELLED: t("booking_status.cancelled"),
    NO_SHOW: t("booking_status.noShow"),
  };

  const badgeClasses = {
    PENDING: "bg-[#f8ece0] text-[#e5a65f]",
    CONFIRMED: "bg-[#f8ece0] text-[#e5a65f]",
    IN_PROGRESS: "bg-[#f8ece0] text-[#e5a65f]",
    COMPLETED: "bg-[#d4f8d4] text-[#2aa85d]",
    CANCELLED: "bg-[#f2dddd] text-[#d09898]",
    NO_SHOW: "bg-[#f2dddd] text-[#d09898]",
  }

  const completedCount = bookings.data
    .filter((item) => item.status === "COMPLETED")
    .length;

  const revenueTotal = useMemo(
    () => bookings.data.reduce((sum, item) => {
      if (item.status !== "COMPLETED") return sum;

      return sum + Number(item.servicePrice);
    }, 0), [bookings],
  );

  return (
    <div className="h-dvh bg-white overflow-hidden">
      <div className="flex h-full w-full flex-col bg-white">
        <main className="flex min-h-0 flex-1 flex-col gap-4 px-3 pt-3 pb-32 sm:px-4 md:pb-6">
          <ScheduleDatePicker
            selectedDate={selectedDate}
            setSelectedDate={(date) => setSelectedDate(date)}
            show="prev_only"
          />

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#8f949a]">
                {t("admin.history.dailyBookings")}
              </h2>
              <span className="rounded-md border border-[#c8ccd1] px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-medium text-[#9ba0a6]">
                {t("admin.history.recordsCount")}: {bookings.data.length}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {isLoading && <HistoryBookingsSkeleton />}

              {isError && !isLoading && (
                <div className="rounded-2xl border border-[#f2dddd] bg-[#fff7f7] px-4 py-6 text-center text-sm text-[#c56b6b]">
                  {error?.response?.data?.message ||
                    error?.message ||
                    t("admin.history.loadingError")}
                </div>
              )}

              {!isLoading && !isError && (
                <div className="divide-y divide-[#d7d9dd] border-y border-[#d7d9dd]">
                  {bookings.data.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-start gap-3 py-3"
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${badgeClasses[item.status]}`}
                      >
                        <UserRound className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[17px] font-semibold leading-tight tracking-tight text-[#0f172a]">
                          {item.customer.name}
                        </p>

                        <p className="truncate text-[12px] font-medium leading-tight">
                          <span className="text-[#f0a339]">{formatToDateString(item.startTime)}</span>
                          <span className="mx-2 text-[#b7bcc2]">•</span>
                          <span className="text-[#8f949a]">
                            {item.serviceName}
                          </span>
                        </p>

                        <p className="truncate text-[9px] uppercase tracking-[0.18em] text-[#b7bcc2]">
                          {item.staff
                            ? `${t("admin.history.staffColumn")}: ${item.staff?.user.name}`
                            : t("admin.history.staff_notFound")}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[22px] font-semibold leading-none tracking-tight text-[#f0932b]">
                          {item.servicePrice} {t("common.sum")}
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${badgeClasses[item.status]}`}
                          >
                            {statusLabels[item.status]}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}

                  {!isLoading && bookings.data.length === 0 && (
                    <div className="py-8 text-center text-sm text-[#8f949a]">
                      {t("admin.history.noBookings")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <footer className="fixed bottom-16 left-0 right-0 z-30 border-t border-[#d7d9dd] bg-white/95 backdrop-blur-sm md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:border-t-0 md:bg-transparent md:backdrop-blur-0 flex w-full items-center justify-between gap-4 px-4 pt-3 pb-4 md:px-0 md:pt-1 md:pb-0">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f0a339]">
                {t("admin.history.totalRevenue")}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-[30px] font-bold tracking-tight text-[#0f1115]">
                  {revenueTotal}
                </p>
                <span className="text-[14px] font-semibold text-[#2aa85d]">
                  +{completedCount}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={bookings.data.length === 0}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#eea338] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(238,163,56,0.35)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#d7d9dd] disabled:shadow-none"
            >
              {exportDone ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2
                  className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`}
                />
              )}
              {isExporting
                ? t("admin.history.exporting")
                : exportDone
                  ? t("admin.history.exportSuccess")
                  : t("admin.history.exportCSV")}
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
