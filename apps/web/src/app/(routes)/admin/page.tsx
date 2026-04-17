"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  Users,
  PlusCircle,
  Bell,
  Settings,
  ChevronDown,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";

type DashboardBaseInfoResponse = {
  sevenDayBookingsCount: number;
  prevSevenDayBookingsCount: number;
  bookingsCountChange: number;
  staffCount: number;
  currentRevenue: number;
  prevRevenue: number;
  revenueChange: number;
};

type AdminDashboardBooking = {
  id: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";
  startTime: string;
  endTime: string;
  user?: {
    name?: string | null;
  } | null;
  service?: {
    name?: string | null;
    durationMin?: number | null;
  } | null;
  staff?: {
    user?: {
      name?: string | null;
    } | null;
  } | null;
};

type TimelineAppointment = {
  id: string;
  startTime: string;
  endTime: string;
  time: string;
  timeRange: string;
  timeMinutes: string;
  customer: string;
  service: string;
  duration: string;
  stylist: string;
  status: AdminDashboardBooking["status"];
};

type AdminShop = {
  id: string;
  name: string;
  ownerId?: string;
};

type ShopsResponse =
  | AdminShop[]
  | {
      shops?: AdminShop[];
      data?: AdminShop[];
    };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { locale, t, language } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] =
    useState<boolean>(false);

  const shopId = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) {
      setPersistedShopId(saved);
    }
    setHasLoadedPersistedShop(true);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const { data: shopsResponse } = useApiQuery<ShopsResponse>(
    isAdmin ? API_ENDPOINTS.shops : null,
    {
      key: ["admin-shops-fallback", user?.id || "guest"],
      enabled: Boolean(
        isAdmin && user?.id && !(user?.shops && user.shops.length > 0),
      ),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const adminShops = useMemo<AdminShop[]>(() => {
    if (!user?.id) return [];

    if (user.shops && user.shops.length > 0) {
      return user.shops.map((shop) => ({
        id: shop.id,
        name: shop.name,
        ownerId: shop.ownerId,
      }));
    }

    if (!shopsResponse) return [];

    const shops = Array.isArray(shopsResponse)
      ? shopsResponse
      : Array.isArray(shopsResponse.shops)
        ? shopsResponse.shops
        : Array.isArray(shopsResponse.data)
          ? shopsResponse.data
          : [];

    return shops.filter((shop) => shop.ownerId === user.id);
  }, [shopsResponse, user?.id, user?.shops]);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    if (shopId && adminShops.some((shop) => shop.id === shopId)) return shopId;
    if (
      persistedShopId &&
      adminShops.some((shop) => shop.id === persistedShopId)
    ) {
      return persistedShopId;
    }
    if (user?.shops?.[0]?.id) return user.shops[0].id;
    if (adminShops[0]?.id) return adminShops[0].id;
    return null;
  }, [hasLoadedPersistedShop, shopId, persistedShopId, user?.shops, adminShops]);

  useEffect(() => {
    if (!hasLoadedPersistedShop || !activeShopId || typeof window === "undefined") return;
    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId, hasLoadedPersistedShop]);

  const getAdminHrefWithShopId = (path: string) => {
    if (!activeShopId) return path;
    return `${path}?shopId=${encodeURIComponent(activeShopId)}`;
  };

  const currentShopName = useMemo(() => {
    if (!user) return t("admin.dashboard.panel");

    if (activeShopId) {
      const foundInUser = (user.shops || []).find(
        (s: any) => s.id === activeShopId,
      );
      const foundInFallback = adminShops.find((s) => s.id === activeShopId);
      return foundInUser?.name || foundInFallback?.name || t("admin.dashboard.panel");
    }

    return user.shops?.[0]?.name || adminShops[0]?.name || t("admin.dashboard.panel");
  }, [activeShopId, adminShops, t, user]);

  const {
    data: baseInfo,
    error: baseInfoError,
    isError: isBaseInfoError,
    isLoading: isBaseInfoLoading,
  } = useApiQuery<DashboardBaseInfoResponse>(
    activeShopId
      ? `${API_ENDPOINTS.admin.dashboardBaseInfo}?shopId=${encodeURIComponent(activeShopId)}`
      : null,
    {
      key: ["admin-dashboard-base-info", activeShopId || "none"],
      enabled: Boolean(user && activeShopId),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      headers: activeShopId
        ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
        : undefined,
    },
  );

  const baseInfoErrorMessage =
    (baseInfoError?.data &&
      typeof baseInfoError.data === "object" &&
      "message" in baseInfoError.data &&
      typeof (baseInfoError.data as { message?: unknown }).message ===
        "string" &&
      (baseInfoError.data as { message: string }).message) ||
    baseInfoError?.message ||
    t("admin.dashboard.error.baseInfoFallback");

  const [now, setNow] = useState<Date>(() => new Date());
  const currentDate = now;

  const revenue = useMemo(() => {
    const value = baseInfo?.currentRevenue ?? 0;
    return new Intl.NumberFormat(locale || undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }, [baseInfo?.currentRevenue, locale]);

  const bookingsCount = baseInfo?.sevenDayBookingsCount ?? 0;
  const bookingsCountChange = baseInfo?.bookingsCountChange ?? 0;
  const staffCount = baseInfo?.staffCount ?? 0;
  const revenueChange = baseInfo?.revenueChange ?? 0;
  const revenueChangeText = `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% ${t("admin.dashboard.period7d")}`;
  const bookingsChangeText = `${bookingsCountChange >= 0 ? "+" : ""}${bookingsCountChange.toFixed(1)}% ${t("admin.dashboard.period7d")}`;
  const monthNames: Record<string, string[]> = {
    'uz-latn': ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktyabr','Noyabr','Dekabr'],
    'uz-cyrl': ['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентябр','Октябр','Ноябр','Декабр'],
    ru: ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
  };
  const weekdayShort: Record<string, string[]> = {
    'uz-latn': ['YAK','DUSH','SESH','CHOR','PAY','JUM','SHA'],
    'uz-cyrl': ['ЯКШ','ДУШ','СЕШ','ЧОР','ПАЙ','ЖУМ','ШАН'],
    ru: ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ'],
  };
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [monthOpen, setMonthOpen] = useState(false);
  const [nowMarkerTop, setNowMarkerTop] = useState<number | null>(null);
  const monthDropdownRef = useRef<HTMLDivElement | null>(null);
  const timelineListRef = useRef<HTMLDivElement | null>(null);
  const appointmentRowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const monthOptions = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const options: Date[] = [];

    for (let month = currentMonth; month < 12; month += 1) {
      options.push(new Date(currentYear, month, 1));
    }

    return options;
  }, [currentDate]);

  useEffect(() => {
    if (!monthOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!monthDropdownRef.current) return
      if (!monthDropdownRef.current.contains(event.target as Node)) {
        setMonthOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMonthOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [monthOpen])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date())
    }, 60000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const minAllowed = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const maxAllowed = new Date(currentDate.getFullYear(), 11, 1)

    if (selectedMonthDate < minAllowed || selectedMonthDate > maxAllowed) {
      setSelectedMonthDate(minAllowed)
    }
  }, [currentDate, selectedMonthDate])

  useEffect(() => {
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const monthYear = selectedMonthDate.getFullYear();
    const monthMonth = selectedMonthDate.getMonth();

    if (selectedYear !== monthYear || selectedMonth !== monthMonth) {
      setSelectedDate(new Date(monthYear, monthMonth, 1));
    }
  }, [selectedDate, selectedMonthDate]);

  const weekDates = useMemo(() => {
    const res: Date[] = []
    const selectedYear = selectedMonthDate.getFullYear()
    const selectedMonth = selectedMonthDate.getMonth()
    const isCurrentMonth = selectedYear === currentDate.getFullYear() && selectedMonth === currentDate.getMonth()
    const start = isCurrentMonth ? new Date(currentDate) : new Date(selectedYear, selectedMonth, 1)
    start.setHours(0, 0, 0, 0)
    const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0)
    const cursor = new Date(start)
    while (cursor <= endOfMonth) {
      res.push(new Date(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
    return res
  }, [currentDate, selectedMonthDate])

  const selectedMonthLabel = (monthNames[language] || monthNames['uz-latn'])[selectedMonthDate.getMonth()]

  const headerWeekday = (weekdayShort[language]?.[currentDate.getDay()] ?? currentDate.toLocaleDateString(locale || undefined, { weekday: 'long' })).toUpperCase()
  const headerMonthDay = `${monthNames[language]?.[currentDate.getMonth()] ?? currentDate.toLocaleDateString(locale || undefined, { month: 'long' })} ${currentDate.getDate()}`.toUpperCase()
  const currentTimeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const selectedDateQuery = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  const {
    data: historyBookings = [],
    isLoading: isHistoryLoading,
    error: historyError,
    isError: isHistoryError,
  } = useApiQuery<AdminDashboardBooking[]>(
    activeShopId
      ? `${API_ENDPOINTS.admin.dashboardHistory}?shopId=${encodeURIComponent(activeShopId)}&date=${encodeURIComponent(selectedDateQuery)}`
      : null,
    {
      key: ["admin-dashboard-history", activeShopId || "none", selectedDateQuery],
      enabled: Boolean(user && activeShopId),
      staleTime: 15_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      headers: activeShopId
        ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
        : undefined,
    },
  );

  const toDurationLabel = (startTime: string, endTime: string) => {
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

  const formatTime = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString(locale || undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const formatMinutesLabel = (
    startTime: string,
    endTime: string,
    durationMin?: number | null,
  ) => {
    if (typeof durationMin === "number" && durationMin > 0) {
      return `${durationMin} min`;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();

    if (Number.isNaN(diffMs) || diffMs <= 0) {
      return "-";
    }

    const totalMinutes = Math.round(diffMs / (1000 * 60));
    return `${totalMinutes} min`;
  };

  const timelineAppointments = useMemo<TimelineAppointment[]>(() => {
    return [...historyBookings]
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
      .map((booking) => {
        const customer =
          booking.user?.name?.trim() || t("admin.dashboard.unknownCustomer");
        const serviceName =
          booking.service?.name?.trim() || t("admin.dashboard.unknownService");
        const stylistName =
          booking.staff?.user?.name?.trim() ||
          booking.user?.name?.trim() ||
          t("admin.dashboard.notAssigned");

        return {
          id: booking.id,
          startTime: booking.startTime,
          endTime: booking.endTime,
          time: formatTime(booking.startTime),
          timeRange: formatTimeRange(booking.startTime, booking.endTime),
          timeMinutes: formatMinutesLabel(
            booking.startTime,
            booking.endTime,
            booking.service?.durationMin,
          ),
          customer,
          service: serviceName,
          duration: toDurationLabel(booking.startTime, booking.endTime),
          stylist: stylistName,
          status: booking.status,
        };
      });
  }, [historyBookings, locale, t]);

  const isSelectedToday = useMemo(
    () => selectedDate.toDateString() === new Date().toDateString(),
    [selectedDate],
  );

  useEffect(() => {
    if (!isSelectedToday || timelineAppointments.length === 0) {
      setNowMarkerTop(null);
      return;
    }

    const points = timelineAppointments
      .map((appointment) => {
        const rowEl = appointmentRowRefs.current[appointment.id];
        if (!rowEl) return null;

        const timeMs = new Date(appointment.startTime).getTime();
        if (Number.isNaN(timeMs)) return null;

        return {
          timeMs,
          y: rowEl.offsetTop + 14,
        };
      })
      .filter((point): point is { timeMs: number; y: number } => Boolean(point))
      .sort((a, b) => a.timeMs - b.timeMs);

    if (points.length === 0) {
      setNowMarkerTop(null);
      return;
    }

    const nowMs = now.getTime();

    if (nowMs <= points[0].timeMs) {
      setNowMarkerTop(points[0].y);
      return;
    }

    for (let i = 0; i < points.length - 1; i += 1) {
      const current = points[i];
      const next = points[i + 1];

      if (nowMs >= current.timeMs && nowMs <= next.timeMs) {
        const ratio = (nowMs - current.timeMs) / (next.timeMs - current.timeMs);
        setNowMarkerTop(current.y + (next.y - current.y) * ratio);
        return;
      }
    }

    if (points.length >= 2) {
      const prev = points[points.length - 2];
      const last = points[points.length - 1];
      const minutesBetween = Math.max((last.timeMs - prev.timeMs) / 60000, 1);
      const yPerMinute = (last.y - prev.y) / minutesBetween;
      const minutesAfterLast = (nowMs - last.timeMs) / 60000;
      setNowMarkerTop(last.y + minutesAfterLast * yPerMinute);
      return;
    }

    setNowMarkerTop(points[0].y);
  }, [isSelectedToday, now, timelineAppointments]);

  const timelineSkeletonItems = useMemo(() => Array.from({ length: 3 }), []);

  const historyErrorMessage =
    (historyError?.data &&
      typeof historyError.data === "object" &&
      "message" in historyError.data &&
      typeof (historyError.data as { message?: unknown }).message ===
        "string" &&
      (historyError.data as { message: string }).message) ||
    historyError?.message ||
    t("admin.dashboard.error.scheduleFallback");

  const statusLabels: Record<AdminDashboardBooking["status"], string> = {
    PENDING: t("history.status.pending"),
    CONFIRMED: t("history.status.confirmed"),
    IN_PROGRESS: t("history.status.inProgress"),
    COMPLETED: t("history.status.completed"),
    CANCELLED: t("history.status.cancelled"),
    NO_SHOW: t("history.status.noShow"),
  };

  const statusStyles = {
    CONFIRMED: {
      badge: "bg-orange-300 text-white",
      card: "border border-gray-300 bg-white",
      dot: "border-gray-300",
      time: "text-gray-500",
    },
    IN_PROGRESS: {
      badge: "bg-[#f59e0b] text-white",
      card: "border border-[#fbbf24] bg-transparent",
      dot: "border-[#f59e0b]",
      time: "text-[#f59e0b]",
    },
    PENDING: {
      badge: "border border-orange-300 bg-orange-50 text-orange-500",
      card: "border border-gray-300 bg-white",
      dot: "border-gray-300",
      time: "text-gray-500",
    },
    CANCELLED: {
      badge: "bg-red-500 text-white",
      card: "border border-red-300 bg-red-50/30",
      dot: "border-red-300",
      time: "text-red-500",
    },
    COMPLETED: {
      badge: "bg-[#059669] text-white",
      card: "border border-[#34d399] bg-transparent",
      dot: "border-[#10b981]",
      time: "text-[#059669]",
    },
    NO_SHOW: {
      badge: "bg-gray-400 text-white",
      card: "border border-gray-300 bg-gray-50",
      dot: "border-gray-300",
      time: "text-gray-500",
    },
  } as const

  return (
    <div className="bg-gray-50 pb-4 sm:pb-24">
      {/* Header pill with avatar and actions (sticky top) */}
      <div className="sticky top-0 z-40 w-full">
        <div className="w-full p-3 flex items-center justify-between border-b md:bg-white md:shadow-sm bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 sm:h-10 sm:w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              {(currentShopName || "A")
                .split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="text-sm font-semibold">{currentShopName}</div>
              <div className="text-xs text-orange-400 uppercase font-semibold">
                {t("admin.dashboard.panel")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600">
              <Bell className="w-4 h-4" />
            </button>
            <button className="h-9 w-9 rounded-full bg-white border shadow flex items-center justify-center text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-5">
        {!activeShopId && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {t("admin.dashboard.shopNotFound")}
          </div>
        )}

        {isBaseInfoError && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("admin.dashboard.error.baseInfoPrefix", { message: baseInfoErrorMessage })}
          </div>
        )}

        {/* Top cards + actions (match mock) */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="relative bg-white rounded-3xl p-5 shadow-lg flex flex-col overflow-visible">
              <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-orange-400 flex items-center justify-center text-white shadow-sm z-10">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-start">
                <div>
                  <p className="text-xs text-gray-500">{t("admin.dashboard.revenue")}</p>
                    {isBaseInfoLoading ? (
                      <div className="mt-2 space-y-2 animate-pulse">
                        <div className="h-8 w-24 rounded-full bg-gray-200" />
                        <div className="h-3 w-20 rounded-full bg-gray-200" />
                      </div>
                    ) : (
                      <>
                        <p className="text-xl sm:text-2xl font-bold mt-2">
                          {revenue}
                        </p>
                        <div
                          className={`mt-3 text-[11px] ${
                            revenueChange >= 0 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {revenueChangeText}
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>

            <div className="relative bg-white rounded-3xl p-5 shadow-lg flex flex-col overflow-visible">
              <div className="absolute top-3 right-3 h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm z-10">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-start">
                <div>
                  <p className="text-xs text-gray-500">{t("admin.dashboard.bookings")}</p>
                    {isBaseInfoLoading ? (
                      <div className="mt-2 space-y-2 animate-pulse">
                        <div className="h-8 w-16 rounded-full bg-gray-200" />
                        <div className="h-3 w-24 rounded-full bg-gray-200" />
                      </div>
                    ) : (
                      <>
                        <p className="text-xl sm:text-2xl font-bold mt-2">
                          {bookingsCount}
                        </p>
                        <div
                          className={`mt-3 text-[11px] ${
                            bookingsCountChange >= 0 ? "text-green-600" : "text-red-500"
                          }`}
                        >
                          {bookingsChangeText}
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center gap-2 sm:gap-3 md:ml-4 w-full">
            <button
              onClick={() => router.push(getAdminHrefWithShopId("/admin/bookings/new"))}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-orange-400 text-white px-3 sm:px-4 py-3 rounded-full shadow-lg"
            >
              <span className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <PlusCircle className="w-4 h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-[10px] sm:text-xs uppercase text-center leading-tight">{t("admin.dashboard.newAppointment")}</span>
            </button>

            <Link
              href={getAdminHrefWithShopId("/admin/staff")}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 bg-white border border-gray-200 px-3 sm:px-4 py-3 rounded-full shadow"
            >
              <span className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-[10px] sm:text-xs uppercase text-center leading-tight">
                {t("admin.dashboard.staff")} ({isBaseInfoLoading ? "..." : staffCount})
              </span>
            </Link>
          </div>
        </div>

        {/* Schedule + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold">{t('booking.timeline')}</h2>
                <div className="text-sm text-gray-500 uppercase mt-1">{headerWeekday}, {headerMonthDay}</div>
              </div>
              <div className="flex items-center gap-3 relative">
                <div ref={monthDropdownRef} className="relative">
                  <button onClick={() => setMonthOpen((s)=>!s)} className="text-sm px-3 py-2 border rounded-full flex items-center gap-2">
                    <span className="text-sm text-orange-400">{selectedMonthLabel}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  {monthOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-xl shadow-lg overflow-hidden z-50">
                      <div className="max-h-44 overflow-y-auto">
                        {monthOptions.map((optionDate) => {
                          const monthIdx = optionDate.getMonth()
                          const optionYear = optionDate.getFullYear()
                          const monthText = (monthNames[language] || monthNames['uz-latn'])[monthIdx]
                          const isSelected =
                            monthIdx === selectedMonthDate.getMonth() &&
                            optionYear === selectedMonthDate.getFullYear()

                          return (
                          <button
                            key={`${optionYear}-${monthIdx}`}
                            onClick={() => {
                              setSelectedMonthDate(new Date(optionYear, monthIdx, 1))
                              const nowDate = new Date()
                              const isCurrentMonth =
                                optionYear === nowDate.getFullYear() &&
                                monthIdx === nowDate.getMonth()

                              if (isCurrentMonth) {
                                const today = new Date(nowDate)
                                today.setHours(0, 0, 0, 0)
                                setSelectedDate(today)
                              } else {
                                setSelectedDate(new Date(optionYear, monthIdx, 1))
                              }
                              setMonthOpen(false)
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 ${isSelected ? 'bg-orange-50' : ''}`}
                          >
                            <div className={`text-sm font-bold ${isSelected ? 'text-orange-500' : 'text-gray-700'}`}>
                              {monthText}
                            </div>
                          </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
                
                <Link
                  href={getAdminHrefWithShopId("/admin/schedule")}
                  className="inline-flex items-center justify-center p-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition"
                  aria-label={t("admin.dashboard.openSchedule")}
                >
                  <SquareArrowOutUpRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Date strip */}
            <div className="p-1 flex items-center gap-3 mb-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {weekDates.map((d) => {
                const isToday = d.toDateString() === currentDate.toDateString()
                const isSelected = d.toDateString() === selectedDate.toDateString()
                const shortDay = (weekdayShort[language]?.[d.getDay()] ?? d.toLocaleDateString(locale || undefined, { weekday: 'short' })).toUpperCase()
                const dayNum = d.getDate()
                return (
                  <button
                    key={d.toDateString()}
                    type="button"
                    onClick={() => {
                      const selected = new Date(d)
                      selected.setHours(0, 0, 0, 0)
                      setSelectedDate(selected)
                      setSelectedMonthDate(new Date(selected.getFullYear(), selected.getMonth(), 1))
                    }}
                    aria-pressed={isSelected}
                    className={`flex flex-col items-center justify-center ${isSelected ? 'py-5 px-6 scale-105' : 'py-3 px-4'} rounded-2xl min-w-16 border transition-all duration-200 ${isSelected ? 'bg-orange-400 text-white shadow-lg border-orange-300 ring-2 ring-orange-200' : 'bg-gray-100 text-gray-700 border-transparent hover:bg-orange-50 hover:text-orange-500'}`}
                  >
                    <div className="text-xs opacity-80">{shortDay}</div>
                    <div className={`font-semibold ${isSelected ? 'text-xl' : ''}`}>{dayNum}</div>
                    {isToday && <div className={`mt-2 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />}
                  </button>
                )
              })}
            </div>

            {/* Timeline area (time and schedule are separated) */}
            <div className="pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {isHistoryError && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {t("admin.dashboard.error.schedulePrefix", { message: historyErrorMessage })}
                </div>
              )}

              {isHistoryLoading && (
                <div className="space-y-4 mb-4">
                  {timelineSkeletonItems.map((_, index) => (
                    <div key={index} className="grid grid-cols-[36px_12px_minmax(0,1fr)] sm:grid-cols-[56px_14px_minmax(0,1fr)] gap-1.5 sm:gap-2 items-start animate-pulse">
                      <div className="pt-2 flex justify-start">
                        <div className="h-3 w-8 rounded-full bg-gray-200" />
                      </div>

                      <div className="relative min-h-full min-w-0">
                        <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gray-200" />
                        <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-200" />
                      </div>

                      <div className="min-w-0">
                        <div className="rounded-3xl px-4 sm:px-5 py-4 shadow-sm border border-gray-200 bg-white">
                          <div className="mb-1 flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                            <div className="h-5 w-28 rounded-full bg-gray-200" />
                            <div className="h-5 w-20 rounded-full bg-gray-200 shrink-0" />
                          </div>
                          <div className="mt-1 flex items-center gap-2 min-w-0">
                            <div className="h-3 w-36 rounded-full bg-gray-200" />
                            <div className="h-5 w-14 rounded-full bg-gray-200 shrink-0" />
                          </div>
                          <div className="my-3 h-px bg-gray-200" />
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="h-6 w-6 rounded-full bg-gray-200" />
                            <div className="h-3 w-40 rounded-full bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isHistoryLoading && !isHistoryError && timelineAppointments.length === 0 && (
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  {t("admin.dashboard.noBookingsForDate")}
                </div>
              )}

              <div ref={timelineListRef} className="space-y-4 relative">
                {isSelectedToday && nowMarkerTop !== null && (
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20"
                    style={{ top: nowMarkerTop }}
                  >
                    <div className="grid grid-cols-[44px_12px_minmax(0,1fr)] sm:grid-cols-[64px_14px_minmax(0,1fr)] gap-1.5 sm:gap-2 items-center">
                      <div className="flex justify-end">
                        <span className="inline-flex rounded-full bg-orange-400 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-sm z-30">
                          {currentTimeLabel}
                        </span>
                      </div>

                      <div className="relative h-3">
                        <span className="absolute left-1/2 top-1/2 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400 ring-4 ring-orange-100" />
                      </div>

                      <div className="relative h-3">
                        <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-orange-300" />
                      </div>
                    </div>
                  </div>
                )}

                {timelineAppointments.map((appointment) => {
                  const statusStyle = statusStyles[appointment.status]
                  const isCompleted = appointment.status === "COMPLETED"

                  return (
                    <Fragment key={appointment.id}>
                      <div
                        ref={(el) => {
                          appointmentRowRefs.current[appointment.id] = el;
                        }}
                        className="relative z-10 grid grid-cols-[44px_12px_minmax(0,1fr)] sm:grid-cols-[64px_14px_minmax(0,1fr)] gap-1.5 sm:gap-2 items-start"
                      >
                        <div className={`pt-2 text-[10px] sm:text-[11px] font-semibold ${statusStyle.time}`}>{appointment.time}</div>

                        <div className="relative min-h-full min-w-0">
                          <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gray-300" />
                          <span className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 bg-white ${statusStyle.dot}`} />
                        </div>

                        <div className="min-w-0 pl-1 sm:pl-1.5">
                          <div
                            className={`rounded-3xl px-4 sm:px-5 py-4 shadow-sm ${statusStyle.card}`}
                            style={
                              isCompleted
                                ? {
                                    backgroundColor: "transparent",
                                    borderColor: "#34d399",
                                  }
                                : undefined
                            }
                          >
                            <div className="mb-1 flex items-start justify-between gap-2 sm:gap-3 min-w-0">
                              <p className="flex-1 min-w-0 text-base sm:text-lg font-bold leading-tight text-gray-900 wrap-break-word">{appointment.customer}</p>
                              <span className={`shrink-0 rounded-full px-2 sm:px-2.5 py-1 text-[8px] sm:text-[9px] font-bold tracking-widest whitespace-nowrap ${statusStyle.badge}`}>
                                {statusLabels[appointment.status] || appointment.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center gap-2 min-w-0 text-xs text-gray-400">
                              <span className="min-w-0 flex-1 truncate">
                                {appointment.service}
                              </span>
                              <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold text-orange-500 whitespace-nowrap">
                                {appointment.timeMinutes}
                              </span>
                            </div>
                            <div className="my-3 h-px bg-gray-300" />
                            <div className="flex items-center gap-2 text-xs text-gray-400 min-w-0">
                              <span className="h-6 w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-semibold">
                                {appointment.stylist
                                  .split(" ")
                                  .map((part) => part[0])
                                  .slice(0, 2)
                                  .join("")
                                  .toUpperCase()}
                              </span>
                              <span className="truncate">{t("booking.staff")}: <span className="font-semibold text-gray-700">{appointment.stylist}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fragment>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
