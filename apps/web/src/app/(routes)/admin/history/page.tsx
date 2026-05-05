"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  Search,
  Share2,
  UserRound,
  Menu,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";

type AdminHistoryBooking = {
  id: string;
  startTime: string;
  endTime: string;
  status:
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW"
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS";
  createdAt?: string;
  staffId?: string | null;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  service?: {
    id?: string;
    name?: string | null;
    price?: string | number | null;
    durationMin?: number | null;
  } | null;
  staff?: {
    user?: {
      id?: string;
      name?: string | null;
    } | null;
  } | null;
};

const formatDateQuery = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

const parseDateQuery = (value: string | null) => {
  if (!value) {
    return normalizeDate(new Date());
  }

  const parsed = normalizeDate(new Date(value));
  return Number.isNaN(parsed.getTime()) ? normalizeDate(new Date()) : parsed;
};

const formatCurrency = (value: number, locale?: string) =>
  formatPrice(Number.isFinite(value) ? value : 0, locale || "uz-UZ");

const formatTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const formatDuration = (startTime: string, endTime: string) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();

  if (Number.isNaN(diffMs) || diffMs <= 0) {
    return "-";
  }

  const totalMinutes = Math.round(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}m`;
};

const getInitials = (value?: string | null) => {
  const text = value?.trim();

  if (!text) {
    return "--";
  }

  return text
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

const buildWeekDays = (referenceDate: Date) => {
  // Build a 5-day window ending at referenceDate (referenceDate is the last day)
  return Array.from({ length: 5 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() - 4 + index);

    return {
      id: formatDateQuery(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
    };
  });
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const shopId = searchParams.get("shopId");
  const [search, setSearch] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const {
    isSidebarVisible,
    isSidebarClosing,
    adminNavItems,
    openSidebar,
    closeSidebar,
    getAdminHrefWithShopId,
  } = useAdminSidebar(shopId);
  const todayDate = useMemo(() => normalizeDate(new Date()), []);
  const todayQuery = useMemo(() => formatDateQuery(todayDate), [todayDate]);
  // `visibleWeekStart` is actually used as the reference (week end) for building
  // the 7-day window in `buildWeekDays`. Initialize it to `todayDate` so the
  // visible week includes today by default.
  const initialWeekStart = useMemo(() => {
    return new Date(todayDate);
  }, [todayDate]);
  const [visibleWeekStart, setVisibleWeekStart] = useState(initialWeekStart);

  const isShopNameLoading = !user;
  const currentShopName = useMemo(() => {
    if (!user) {
      return t("admin.dashboard.panel");
    }

    if (shopId) {
      const activeShop = user.shops?.find((shop) => shop.id === shopId);
      return activeShop?.name || t("admin.dashboard.panel");
    }

    return user.shops?.[0]?.name || t("admin.dashboard.panel");
  }, [shopId, t, user]);

  const selectedDate = useMemo(() => {
    const parsedDate = parseDateQuery(searchParams.get("date"));
    return parsedDate > todayDate ? new Date(todayDate) : parsedDate;
  }, [searchParams, todayDate]);
  const selectedDateQuery = useMemo(
    () => formatDateQuery(selectedDate),
    [selectedDate],
  );
  const searchQuery = search.trim();

  const weekDays = useMemo(
    () => buildWeekDays(visibleWeekStart),
    [visibleWeekStart],
  );

  const historyUrl = shopId
    ? `${API_ENDPOINTS.admin.dashboardHistory}?shopId=${encodeURIComponent(shopId)}&date=${encodeURIComponent(selectedDateQuery)}`
    : null;

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useApiQuery<AdminHistoryBooking[]>(historyUrl, {
    key: ["admin-history", shopId || "none", selectedDateQuery],
    enabled: Boolean(shopId),
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    queryOptions: {
      refetchInterval: 15_000,
    },
    headers: shopId ? { "x-shopid": shopId, "x-shop-id": shopId } : undefined,
  });

  const handleDateChange = (date: string) => {
    if (!shopId) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("shopId", shopId);
    params.set("date", date > todayQuery ? todayQuery : date);
    router.replace(`/admin/history?${params.toString()}`);
  };

  const moveBackOneDay = () => {
    // Move only the visible 5-day window back without changing selected date.
    const nextWeekStart = normalizeDate(new Date(visibleWeekStart));
    nextWeekStart.setDate(nextWeekStart.getDate() - 5);
    setVisibleWeekStart(nextWeekStart);
  };

  const moveForwardOneWeek = () => {
    // Move forward by 5 days
    const nextDate = normalizeDate(new Date(selectedDate));
    nextDate.setDate(nextDate.getDate() + 5);

    const nextWeekStart = normalizeDate(new Date(visibleWeekStart));
    nextWeekStart.setDate(nextWeekStart.getDate() + 5);
    setVisibleWeekStart(nextWeekStart);

    handleDateChange(
      formatDateQuery(nextDate > todayDate ? todayDate : nextDate),
    );
  };

  // Allow moving forward only while the visible week's reference (end) is
  // strictly before today.
  const canMoveForward = visibleWeekStart < todayDate;

  const statusLabels: Record<AdminHistoryBooking["status"], string> = {
    PENDING: t("history.status.pending"),
    CONFIRMED: t("history.status.confirmed"),
    IN_PROGRESS: t("history.status.inProgress"),
    COMPLETED: t("history.status.completed"),
    CANCELLED: t("history.status.cancelled"),
    NO_SHOW: t("history.status.noShow"),
  };

  const normalizedBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .map((booking) => {
      const customerName =
        booking.user?.name?.trim() || t("admin.history.unknownCustomer");
      const serviceName =
        booking.service?.name?.trim() || t("admin.history.unknownService");
      const staffName =
        booking.staff?.user?.name?.trim() || t("admin.history.unassigned");
      const amountValue = Number(booking.service?.price ?? 0);

      return {
        id: booking.id,
        customerName,
        serviceName,
        staffName,
        time: formatTime(booking.startTime),
        duration: formatDuration(booking.startTime, booking.endTime),
        amount: formatCurrency(amountValue, locale),
        status: booking.status,
        statusLabel: statusLabels[booking.status],
        badgeClass:
          booking.status === "COMPLETED"
            ? "bg-[#d4f8d4] text-[#2aa85d]"
            : booking.status === "CANCELLED" || booking.status === "NO_SHOW"
              ? "bg-[#f2dddd] text-[#d09898]"
              : "bg-[#f8ece0] text-[#e5a65f]",
        iconClass:
          booking.status === "COMPLETED"
            ? "bg-[#dff5e5] text-[#2aa85d]"
            : booking.status === "CANCELLED" || booking.status === "NO_SHOW"
              ? "bg-[#f2dddd] text-[#d09898]"
              : "bg-[#f8ece0] text-[#e5a65f]",
      };
    });

  const filteredBookings = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) {
      return normalizedBookings;
    }

    return normalizedBookings.filter((booking) => {
      return (
        booking.customerName.toLowerCase().includes(q) ||
        booking.serviceName.toLowerCase().includes(q) ||
        booking.staffName.toLowerCase().includes(q) ||
        booking.amount.toLowerCase().includes(q)
      );
    });
  }, [normalizedBookings, search]);

  const completedCount = useMemo(
    () => bookings.filter((item) => item.status === "COMPLETED").length,
    [bookings],
  );

  const cancelledCount = useMemo(
    () =>
      bookings.filter(
        (item) => item.status === "CANCELLED" || item.status === "NO_SHOW",
      ).length,
    [bookings],
  );

  const revenueTotal = useMemo(
    () =>
      bookings.reduce((sum, item) => {
        if (item.status !== "COMPLETED") {
          return sum;
        }

        return sum + Number(item.service?.price ?? 0);
      }, 0),
    [bookings],
  );

  const handleExport = () => {
    if (isExporting || filteredBookings.length === 0) {
      return;
    }

    setExportDone(false);
    setIsExporting(true);

    const csvRows = [
      ["Time", "Customer", "Service", "Staff", "Status", "Amount", "Duration"],
      ...filteredBookings.map((item) => [
        item.time,
        item.customerName,
        item.serviceName,
        item.staffName,
        item.statusLabel,
        item.amount,
        item.duration,
      ]),
    ];

    const csv = csvRows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `shop-history-${selectedDateQuery}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    window.setTimeout(() => {
      setIsExporting(false);
      setExportDone(true);

      window.setTimeout(() => {
        setExportDone(false);
      }, 1300);
    }, 450);
  };

  const renderBookingSkeleton = (key: string) => (
    <article key={key} className="border-b border-[#dfe3e8] py-3">
      <div className="animate-pulse">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-7 w-7 rounded-md bg-[#eef1f5]" />

          <div className="min-w-0 flex-1">
            <div className="h-6 w-36 rounded-full bg-[#eef1f5]" />
            <div className="mt-2 h-4 w-44 rounded-full bg-[#eef1f5]" />
            <div className="mt-2 h-3 w-40 rounded-full bg-[#eef1f5]" />
          </div>

          <div className="text-right">
            <div className="h-7 w-16 rounded-full bg-[#fff2e4]" />
            <div className="mt-2 h-4 w-14 rounded-full bg-[#eef1f5]" />
          </div>
        </div>
      </div>
    </article>
  );

  return (
    <div className="h-dvh bg-white overflow-hidden">
      <AdminSidebar
        isVisible={isSidebarVisible}
        isClosing={isSidebarClosing}
        currentShopName={currentShopName}
        adminNavItems={adminNavItems}
        onClose={closeSidebar}
        getAdminHrefWithShopId={getAdminHrefWithShopId}
      />

      <div className="mx-auto flex h-full w-full max-w-107.5 flex-col bg-white">
        <div className="sticky top-0 z-40 w-full">
          <div className="mx-auto flex w-full max-w-107.5 items-center justify-between border-b bg-orange-50 p-3 md:bg-white md:shadow-sm">
            <div className="flex items-center gap-3">
              {isShopNameLoading ? (
                <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-10" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 sm:h-10 sm:w-10">
                  {(currentShopName || "A")
                    .split(" ")
                    .map((s: string) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
              <div>
                {isShopNameLoading ? (
                  <div className="h-4 w-28 animate-pulse rounded-full bg-gray-200" />
                ) : (
                  <div className="text-sm font-semibold">{currentShopName}</div>
                )}
                <div className="text-xs font-semibold uppercase text-orange-400">
                  {t("admin.dashboard.panel")}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 shadow">
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openSidebar}
                aria-label="Open admin sidebar"
                className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 shadow transition-colors hover:bg-[#f4f4f4]"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex min-h-0 flex-1 flex-col gap-4 px-3 pt-3 pb-32 sm:px-4 md:pb-6">
          {!shopId ? (
            <div className="rounded-2xl border border-[#d7d9dd] bg-[#fafafa] p-4 text-sm text-[#8f949a]">
              {t("admin.history.noShopSelected")}
            </div>
          ) : null}

          <div className="hidden sm:flex sm:flex-col sm:gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.history.searchPlaceholder")}
                className="w-full rounded-[18px] border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:hidden">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa0aa]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("admin.history.searchPlaceholder")}
                className="w-full rounded-full border border-[#d7d7d7] bg-white py-4 pl-11 pr-4 text-[15px] text-[#2c3138] placeholder:text-[#9aa0aa] shadow-[0_10px_28px_rgba(17,24,39,0.04)] transition-all duration-200 focus:border-[#F49B33] focus:outline-none"
              />
            </div>
          </div>

          <section className="rounded-[26px] sm:px-4">
            <div
              className={`grid items-stretch gap-1.5 sm:gap-2 ${canMoveForward ? "grid-cols-7" : "grid-cols-6"}`}
            >
              <button
                type="button"
                onClick={moveBackOneDay}
                className="inline-flex h-14.5 w-full items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-700 shadow-[0_6px_18px_rgba(15,17,21,0.04)] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                aria-label="Previous day"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {weekDays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDateChange(day.id)}
                  className={`flex h-14.5 w-full min-w-0 flex-col items-center justify-center rounded-[10px] border px-1 text-center leading-tight transition-all duration-200 ${
                    day.id === selectedDateQuery
                      ? "border-[#F49B33] bg-[#F49B33] text-white shadow-[0_12px_22px_rgba(244,155,51,0.24)]"
                      : "border-slate-200 bg-white text-[#1f2a36] hover:border-[#F49B33] hover:bg-[#fff8ee]"
                  } active:scale-95`}
                >
                  <p className="text-[10px] font-semibold uppercase leading-none tracking-[0.12em] sm:text-[9px]">
                    {day.day}
                  </p>
                  <p className="mt-1 text-[17px] font-semibold leading-none tracking-tight sm:text-[24px]">
                    {day.date}
                  </p>
                </button>
              ))}

              {canMoveForward && (
                <button
                  type="button"
                  onClick={moveForwardOneWeek}
                  className="inline-flex h-14.5 w-full items-center justify-center rounded-[10px] border border-slate-200 bg-white text-slate-700 shadow-[0_6px_18px_rgba(15,17,21,0.04)] transition-transform duration-200 hover:scale-[1.02] active:scale-95"
                  aria-label="Next day"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#8f949a]">
                {t("admin.history.dailyBookings")}
              </h2>
              <span className="rounded-md border border-[#c8ccd1] px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-medium text-[#9ba0a6]">
                {filteredBookings.length} {t("admin.history.recordsCount")}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {isLoading && (
                <div className="border-y border-[#d7d9dd]">
                  {renderBookingSkeleton("history-skeleton-1")}
                  {renderBookingSkeleton("history-skeleton-2")}
                  {renderBookingSkeleton("history-skeleton-3")}
                </div>
              )}

              {isError && !isLoading && (
                <div className="rounded-2xl border border-[#f2dddd] bg-[#fff7f7] px-4 py-6 text-center text-sm text-[#c56b6b]">
                  {error?.data?.message ||
                    error?.message ||
                    t("admin.history.loadingError")}
                </div>
              )}

              {!isLoading && !isError && (
                <div className="divide-y divide-[#d7d9dd] border-y border-[#d7d9dd]">
                  {filteredBookings.map((item) => (
                    <article
                      key={item.id}
                      className="flex items-start gap-3 py-3"
                    >
                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${item.iconClass}`}
                      >
                        <UserRound className="h-3.5 w-3.5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[17px] font-semibold leading-tight tracking-tight text-[#0f172a]">
                          {item.customerName}
                        </p>
                        <p className="truncate text-[12px] font-medium leading-tight">
                          <span className="text-[#f0a339]">{item.time}</span>
                          <span className="mx-2 text-[#b7bcc2]">•</span>
                          <span className="text-[#8f949a]">
                            {item.serviceName}
                          </span>
                        </p>
                        <p className="truncate text-[9px] uppercase tracking-[0.18em] text-[#b7bcc2]">
                          {t("admin.history.staffColumn")}: {item.staffName}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[22px] font-semibold leading-none tracking-tight text-[#f0932b]">
                          {item.amount}
                        </p>
                        <div className="flex items-center justify-end gap-2 pt-2">
                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${item.badgeClass}`}
                          >
                            {item.statusLabel}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}

                  {!isLoading && filteredBookings.length === 0 && (
                    <div className="py-8 text-center text-sm text-[#8f949a]">
                      {t("admin.history.noBookings")}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <footer className="fixed bottom-16 left-0 right-0 z-30 border-t border-[#d7d9dd] bg-white/95 backdrop-blur-sm md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:border-t-0 md:bg-transparent md:backdrop-blur-0">
            <div className="mx-auto flex w-full max-w-107.5 items-end justify-between gap-4 px-4 pt-3 pb-4 md:px-0 md:pt-1 md:pb-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f0a339]">
                  {t("admin.history.totalRevenue")}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-[30px] font-bold tracking-tight text-[#0f1115]">
                    {formatCurrency(revenueTotal, locale)}
                  </p>
                  <span className="text-[14px] font-semibold text-[#2aa85d]">
                    +{completedCount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExport}
                disabled={filteredBookings.length === 0}
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
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
