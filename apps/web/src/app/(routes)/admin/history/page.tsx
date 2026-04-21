"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Check,
  ChevronLeft,
  MoreVertical,
  Search,
  Share2,
  UserRound,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";

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

const parseDateQuery = (value: string | null) => {
  if (!value) {
    return new Date();
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);

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
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setDate(referenceDate.getDate() - 3 + index);

    return {
      id: formatDateQuery(date),
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.getDate(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });
};

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shopId");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);

  const selectedDate = useMemo(
    () => parseDateQuery(searchParams.get("date")),
    [searchParams],
  );
  const selectedDateQuery = useMemo(
    () => formatDateQuery(selectedDate),
    [selectedDate],
  );
  const searchQuery = search.trim();

  const weekDays = useMemo(() => buildWeekDays(selectedDate), [selectedDate]);

  const historyUrl = shopId
    ? `${API_ENDPOINTS.admin.dashboardHistory}?shopId=${encodeURIComponent(shopId)}&date=${encodeURIComponent(selectedDateQuery)}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
    : null;

  const {
    data: bookings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useApiQuery<AdminHistoryBooking[]>(historyUrl, {
    key: ["admin-history", shopId || "none", selectedDateQuery, searchQuery],
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
    params.set("date", date);
    router.replace(`/admin/history?${params.toString()}`);
  };

  const normalizedBookings = useMemo(() => {
    return [...bookings]
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      .map((booking) => {
        const customerName = booking.user?.name?.trim() || "Unknown customer";
        const serviceName = booking.service?.name?.trim() || "Unknown service";
        const staffName = booking.staff?.user?.name?.trim() || "Unassigned";
        const amountValue = Number(booking.service?.price ?? 0);

        return {
          id: booking.id,
          customerName,
          serviceName,
          staffName,
          time: formatTime(booking.startTime),
          duration: formatDuration(booking.startTime, booking.endTime),
          amount: formatCurrency(amountValue),
          status: booking.status,
          statusLabel:
            booking.status === "COMPLETED"
              ? "Completed"
              : booking.status === "CANCELLED"
                ? "Cancelled"
                : booking.status === "NO_SHOW"
                  ? "No show"
                  : booking.status.replaceAll("_", " "),
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
  }, [bookings]);

  const filteredBookings = normalizedBookings;

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
    <div className="min-h-dvh bg-white">
      <div className="mx-auto w-full bg-white">
        <header className="sticky top-0 z-10 border-b border-[#d6d6d6] bg-white px-4 py-3 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="absolute left-0 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cfcfcf] text-[#8f8f8f] transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h1 className="text-[30px] font-bold tracking-tight text-[#191919]">
              Shop History
            </h1>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="absolute right-0 inline-flex h-8 w-8 items-center justify-center rounded-full text-[#9e9e9e] transition-colors duration-200 hover:bg-[#e7e7e7]"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-10 w-44 rounded-lg border border-[#d7d9dd] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => refetch()}
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-[#4e5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Refresh Logs
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="w-full rounded-md px-3 py-2 text-left text-xs font-medium text-[#4e5560] transition-colors hover:bg-[#f7f7f7]"
                >
                  Export CSV
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="space-y-5 px-4 pb-6 pt-3">
          {!shopId ? (
            <div className="rounded-2xl border border-[#d7d9dd] bg-[#fafafa] p-4 text-sm text-[#8f949a]">
              shopId topilmadi. Sahifani{" "}
              <span className="font-semibold text-[#191919]">
                /admin/history?shopId=...
              </span>{" "}
              ko'rinishida oching.
            </div>
          ) : null}

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8f949a]" />
              <input
                type="text"
                placeholder="Search customer or staff..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-[#aeb6c1] bg-transparent py-2.5 pl-10 pr-3 text-[13px] text-[#2c2f34] placeholder:text-[#8f949a] transition-colors focus:border-[#f0a339] focus:outline-none"
              />
            </div>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              {weekDays.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleDateChange(day.id)}
                  className={`min-w-12 rounded-2xl border px-2 py-1.5 text-center leading-tight transition-colors ${
                    day.id === selectedDateQuery
                      ? "border-[#efa83c] bg-[#efa83c] text-white"
                      : day.isWeekend
                        ? "border-[#c5ccd7] bg-white text-[#b4bcc9]"
                        : "border-[#3b4858] bg-white text-[#1f2a36]"
                  } active:scale-95`}
                >
                  <p className="text-[9px] font-semibold leading-none">
                    {day.day}
                  </p>
                  <p className="mt-1 text-[28px] font-semibold leading-none tracking-tight">
                    {day.date}
                  </p>
                </button>
              ))}
            </div>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#8f949a]">
                Daily Bookings
              </h2>
              <span className="rounded-md border border-[#c8ccd1] px-2 py-1 text-[10px] font-medium text-[#9ba0a6]">
                {filteredBookings.length} Logs
              </span>
            </div>

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
                  "History data could not be loaded."}
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
                      <p className="truncate text-[20px] font-semibold leading-tight tracking-tight text-[#0f172a]">
                        {item.customerName}
                      </p>
                      <p className="truncate text-[13px] font-medium leading-tight">
                        <span className="text-[#f0a339]">{item.time}</span>
                        <span className="mx-2 text-[#b7bcc2]">•</span>
                        <span className="text-[#8f949a]">
                          {item.serviceName}
                        </span>
                      </p>
                      <p className="truncate text-[10px] uppercase tracking-[0.18em] text-[#b7bcc2]">
                        Staff: {item.staffName}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[32px] font-semibold leading-none tracking-tight text-[#f0932b]">
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
                    Bu kunga mos transaction topilmadi.
                  </div>
                )}
              </div>
            )}
          </section>

          <footer className="flex items-end justify-between pt-1">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f0a339]">
                Daily Total Revenue
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-[42px] font-bold tracking-tight text-[#0f1115]">
                  {formatCurrency(revenueTotal)}
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
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#eea338] px-5 py-3 text-[16px] font-semibold text-white shadow-[0_8px_18px_rgba(238,163,56,0.35)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#d7d9dd] disabled:shadow-none"
              >
                {exportDone ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Share2
                    className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`}
                  />
                )}
                {isExporting
                  ? "Exporting..."
                  : exportDone
                    ? "Exported"
                    : "Export"}
              </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
