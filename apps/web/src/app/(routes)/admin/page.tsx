"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  DollarSign,
  Users,
  PlusCircle,
  Bell,
  Menu,
  CircleUser,
  ChevronDown,
  CircleCheckBig,
  CircleX,
  SquareArrowOutUpRight,
  CalendarDays,
  ClipboardList,
  Scissors,
  History,
  X,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";

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
  durationMin?: number | null;
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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] =
    useState<boolean>(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const sidebarCloseTimerRef = useRef<number | null>(null);

  const shopId = searchParams.get("shopId");
  const selectedShopHint = shopId || persistedShopId;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem("selected_shop_id");
    if (saved) {
      setPersistedShopId(saved);
    }
    setHasLoadedPersistedShop(true);
  }, []);

  const isAdmin = user?.role === "ADMIN";
  const { data: shopsResponse, isLoading: isLoadingShopsFallback } = useApiQuery<ShopsResponse>(
    isAdmin ? API_ENDPOINTS.shops : null,
    {
      key: ["admin-shops-fallback", user?.id || "guest"],
      enabled: Boolean(
        isAdmin &&
          user?.id &&
          (
            !(user?.shops && user.shops.length > 0) ||
            Boolean(
              selectedShopHint &&
                !(user?.shops || []).some((shop) => shop.id === selectedShopHint),
            )
          ),
      ),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  const adminShops = useMemo<AdminShop[]>(() => {
    if (!user?.id) return [];

    const userShops = (user.shops || []).map((shop) => ({
      id: shop.id,
      name: shop.name,
      ownerId: shop.ownerId,
    }));

    if (!shopsResponse) return userShops;

    const shops = Array.isArray(shopsResponse)
      ? shopsResponse
      : Array.isArray(shopsResponse.shops)
        ? shopsResponse.shops
        : Array.isArray(shopsResponse.data)
          ? shopsResponse.data
          : [];

    const fallbackShops = shops.filter((shop) => shop.ownerId === user.id);

    if (fallbackShops.length === 0) return userShops;
    if (userShops.length === 0) return fallbackShops;

    const merged = new Map<string, AdminShop>();
    userShops.forEach((shop) => merged.set(shop.id, shop));
    fallbackShops.forEach((shop) => merged.set(shop.id, shop));
    return Array.from(merged.values());
  }, [shopsResponse, user?.id, user?.shops]);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    // Trust explicit URL/localStorage selection first.
    // This is important right after creating a new shop because `user.shops`
    // can be stale for a moment and may not include the new shop yet.
    if (shopId) return shopId;
    if (persistedShopId) return persistedShopId;

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

  const openSidebar = () => {
    if (sidebarCloseTimerRef.current) {
      window.clearTimeout(sidebarCloseTimerRef.current);
      sidebarCloseTimerRef.current = null;
    }
    setIsSidebarVisible(true);
    setIsSidebarClosing(false);
  };

  const closeSidebar = () => {
    if (!isSidebarVisible || isSidebarClosing) return;
    setIsSidebarClosing(true);
    sidebarCloseTimerRef.current = window.setTimeout(() => {
      setIsSidebarVisible(false);
      setIsSidebarClosing(false);
      sidebarCloseTimerRef.current = null;
    }, 280);
  };

  type AdminNavItem = {
    title: string;
    href: string;
    icon: typeof BarChart3;
    exact?: boolean;
  };

  const adminNavItems = useMemo<AdminNavItem[]>(
    () => [
      {
        title: t("admin.dashboard.panel"),
        href: getAdminHrefWithShopId("/admin"),
        icon: BarChart3,
        exact: true,
      },
      {
        title: t("admin.analytics.title") || "Analytics",
        href: getAdminHrefWithShopId("/admin/analytics"),
        icon: ClipboardList,
      },
      {
        title: t("admin.schedule.title") || "Schedule",
        href: getAdminHrefWithShopId("/admin/schedule"),
        icon: CalendarDays,
      },
      {
        title: t("services.title") || "Services",
        href: getAdminHrefWithShopId("/admin/services"),
        icon: Scissors,
      },
      {
        title: t("admin.history.title") || "History",
        href: getAdminHrefWithShopId("/admin/history"),
        icon: History,
      },
      {
        title: t("admin.staff.title") || "Staff",
        href: getAdminHrefWithShopId("/admin/staff"),
        icon: Users,
      },
      {
        title: t("nav.profile") || "Profile",
        href: "/profile",
        icon: CircleUser,
      },
    ],
    [activeShopId, t],
  );

  const resolvedCurrentShop = useMemo(() => {
    if (!user) return null;

    if (activeShopId) {
      const foundInUser = (user.shops || []).find(
        (s: any) => s.id === activeShopId,
      );
      const foundInFallback = adminShops.find((s) => s.id === activeShopId);
      return foundInUser || foundInFallback || null;
    }

    return (user.shops?.[0] as any) || adminShops[0] || null;
  }, [activeShopId, adminShops, user]);

  const currentShopName = resolvedCurrentShop?.name || t("admin.dashboard.panel");

  const isShopNameLoading = useMemo(() => {
    if (!hasLoadedPersistedShop) return true;
    if (!activeShopId) return false;
    if (resolvedCurrentShop?.name) return false;
    return isLoadingShopsFallback;
  }, [activeShopId, hasLoadedPersistedShop, isLoadingShopsFallback, resolvedCurrentShop?.name]);

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
    return formatPrice(value, locale || "uz-UZ");
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
  const [selectedPendingAppointment, setSelectedPendingAppointment] =
    useState<TimelineAppointment | null>(null);
  const monthDropdownRef = useRef<HTMLDivElement | null>(null);
  const timelineListRef = useRef<HTMLDivElement | null>(null);
  const appointmentRowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const appointmentCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!isSidebarVisible && !isSidebarClosing) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSidebarVisible, isSidebarClosing]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const shouldLockScroll = isSidebarVisible && !isSidebarClosing;
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      if (shouldLockScroll) {
        document.body.style.overflow = "";
      }
    };
  }, [isSidebarVisible, isSidebarClosing]);

  useEffect(() => {
    return () => {
      if (sidebarCloseTimerRef.current) {
        window.clearTimeout(sidebarCloseTimerRef.current);
      }
    };
  }, []);

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
    refetch: refetchHistory,
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

  const parseBackendWallClockDate = (value: string) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return parsed;
    }

    const hasExplicitTimezone = /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);
    if (!hasExplicitTimezone) {
      return parsed;
    }

    return new Date(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate(),
      parsed.getUTCHours(),
      parsed.getUTCMinutes(),
      parsed.getUTCSeconds(),
      parsed.getUTCMilliseconds(),
    );
  };

  const toDurationLabel = (startTime: string, endTime: string) => {
    const start = parseBackendWallClockDate(startTime);
    const end = parseBackendWallClockDate(endTime);
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
    const date = parseBackendWallClockDate(value);

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

    const start = parseBackendWallClockDate(startTime);
    const end = parseBackendWallClockDate(endTime);
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
          parseBackendWallClockDate(a.startTime).getTime() -
          parseBackendWallClockDate(b.startTime).getTime(),
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
          durationMin: booking.service?.durationMin ?? null,
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
        const cardEl = appointmentCardRefs.current[appointment.id];
        if (!rowEl) return null;

        const startMs = parseBackendWallClockDate(
          appointment.startTime,
        ).getTime();
        const fallbackEndMs = parseBackendWallClockDate(
          appointment.endTime,
        ).getTime();
        const durationBasedEndMs =
          typeof appointment.durationMin === "number" && appointment.durationMin > 0
            ? startMs + appointment.durationMin * 60 * 1000
            : NaN;
        const endMs = Number.isNaN(durationBasedEndMs)
          ? fallbackEndMs
          : durationBasedEndMs;

        if (Number.isNaN(startMs) || Number.isNaN(endMs)) return null;

        const startY = rowEl.offsetTop + 14;
        const cardBottomY = cardEl
          ? rowEl.offsetTop + cardEl.offsetTop + cardEl.offsetHeight
          : rowEl.offsetTop + rowEl.offsetHeight;
        const endY = Math.max(startY, cardBottomY);

        return {
          startMs,
          endMs: Math.max(endMs, startMs),
          startY,
          endY,
        };
      })
      .filter(
        (
          point,
        ): point is {
          startMs: number;
          endMs: number;
          startY: number;
          endY: number;
        } => Boolean(point),
      )
      .sort((a, b) => a.startMs - b.startMs);

    if (points.length === 0) {
      setNowMarkerTop(null);
      return;
    }

    const nowMs = now.getTime();

    if (nowMs <= points[0].startMs) {
      setNowMarkerTop(points[0].startY);
      return;
    }

    for (let i = 0; i < points.length; i += 1) {
      const current = points[i];
      const next = points[i + 1];
      const duration = Math.max(current.endMs - current.startMs, 1);

      // If current time is inside a service, move marker through that card.
      if (nowMs >= current.startMs && nowMs <= current.endMs) {
        const ratio = (nowMs - current.startMs) / duration;
        setNowMarkerTop(
          current.startY + (current.endY - current.startY) * ratio,
        );
        return;
      }

      // If between current service end and next service start, keep at current card bottom.
      if (next && nowMs > current.endMs && nowMs < next.startMs) {
        setNowMarkerTop(current.endY);
        return;
      }
    }

    // After the last service, keep marker at the very bottom of timeline content.
    const timelineBottomY = timelineListRef.current?.scrollHeight;
    setNowMarkerTop(
      Math.max(points[points.length - 1].endY, timelineBottomY || 0),
    );
  }, [isSelectedToday, now, timelineAppointments]);

  const timelineSkeletonItems = useMemo(() => Array.from({ length: 3 }), []);

  const { mutateAsync: completeBooking, isPending: isCompletingBooking } =
    useApiMutation<unknown, { bookingId: string }>(
      ({ bookingId }) => API_ENDPOINTS.admin.bookingComplete(bookingId),
      "put",
      () => ({
        headers: activeShopId
          ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
          : undefined,
      }),
    );

  const { mutateAsync: cancelBooking, isPending: isCancellingBooking } =
    useApiMutation<unknown, { bookingId: string }>(
      ({ bookingId }) => API_ENDPOINTS.admin.bookingCancel(bookingId),
      "put",
      () => ({
        headers: activeShopId
          ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
          : undefined,
      }),
    );

  const isUpdatingBookingStatus = isCompletingBooking || isCancellingBooking;

  const closePendingAppointmentModal = () => {
    if (isUpdatingBookingStatus) return;
    setSelectedPendingAppointment(null);
  };

  const openPendingAppointmentModal = (appointment: TimelineAppointment) => {
    if (appointment.status !== "PENDING") return;
    setSelectedPendingAppointment(appointment);
  };

  const updatePendingAppointmentStatus = async (
    nextStatus: "COMPLETED" | "CANCELLED",
  ) => {
    if (!selectedPendingAppointment || !activeShopId) return;

    const payload = { bookingId: selectedPendingAppointment.id };

    try {
      if (nextStatus === "COMPLETED") {
        await completeBooking(payload);
      } else {
        await cancelBooking(payload);
      }

      // Close modal immediately after successful mutation so UX is snappy.
      setSelectedPendingAppointment(null);

      // Refetch history in background; we don't need to block the UI on this.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetchHistory();
    } catch {
      // Toasts are handled by useApiMutation.
    }
  };

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
        <div className="mx-auto flex w-full max-w-360 items-center justify-between border-b bg-orange-50 p-3 md:bg-white md:px-5 md:py-4 lg:px-6 lg:py-5">
          <div className="flex items-center gap-3 md:gap-4 lg:gap-4">
            {isShopNameLoading ? (
              <div className="h-12 w-12 md:h-11 md:w-11 lg:h-12 lg:w-12 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div className="h-12 w-12 md:h-11 md:w-11 lg:h-12 lg:w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                {(currentShopName || "A")
                  .split(" ")
                  .map((s: string) => s[0])
                  .slice(0, 2)
                  .join("")}
              </div>
            )}
            <div>
              {isShopNameLoading ? (
                <div className="h-4 w-28 md:w-32 lg:w-36 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <div className="text-sm md:text-base lg:text-lg font-semibold">{currentShopName}</div>
              )}
              <div className="text-xs md:text-[13px] lg:text-sm text-orange-400 uppercase font-semibold">
                {t("admin.dashboard.panel")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full bg-white border shadow flex items-center justify-center text-gray-600">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={openSidebar}
              className="h-9 w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full bg-white border shadow flex items-center justify-center text-gray-600"
              aria-label="Open admin sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AdminSidebar
        isVisible={isSidebarVisible}
        isClosing={isSidebarClosing}
        currentShopName={currentShopName}
        adminNavItems={adminNavItems}
        onClose={closeSidebar}
        getAdminHrefWithShopId={getAdminHrefWithShopId}
      />

      <div className="mx-auto mt-5 w-full max-w-360 px-4">
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
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 lg:gap-6">
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3 md:gap-4 lg:gap-4">
            <div className="relative bg-white rounded-2xl md:rounded-2xl lg:rounded-3xl p-4 md:p-5 lg:p-5 shadow-lg flex flex-col overflow-visible">
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
                        <p className="text-lg sm:text-xl font-bold mt-2 wrap-break-word line-clamp-2">
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

          <div className="flex flex-row items-center gap-2 md:gap-3 lg:gap-4 md:w-auto lg:ml-4 w-full md:min-w-max">
            <button
              onClick={() => {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
                const day = String(selectedDate.getDate()).padStart(2, "0");
                const dateValue = `${year}-${month}-${day}`;
                const base = getAdminHrefWithShopId("/admin/bookings/new");
                const joiner = base.includes("?") ? "&" : "?";
                router.push(`${base}${joiner}date=${encodeURIComponent(dateValue)}`);
              }}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-2 lg:gap-3 bg-orange-400 text-white px-3 md:px-3 lg:px-4 py-2.5 md:py-2.5 lg:py-3 rounded-full shadow-lg"
            >
              <span className="h-6 w-6 md:h-6 md:w-6 lg:h-8 lg:w-8 rounded-full bg-white flex items-center justify-center shrink-0">
                <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-[9px] md:text-[10px] lg:text-xs uppercase text-center leading-tight">{t("admin.dashboard.newAppointment")}</span>
            </button>

            <Link
              href={getAdminHrefWithShopId("/admin/staff")}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-2 lg:gap-3 bg-white border border-gray-200 px-3 md:px-3 lg:px-4 py-2.5 md:py-2.5 lg:py-3 rounded-full shadow"
            >
              <span className="h-6 w-6 md:h-6 md:w-6 lg:h-10 lg:w-10 rounded-full bg-white flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />
              </span>
              <span className="font-semibold text-[9px] md:text-[10px] lg:text-xs uppercase text-center leading-tight">
                {t("admin.dashboard.staff")} ({isBaseInfoLoading ? "..." : staffCount})
              </span>
            </Link>
          </div>
        </div>

        {/* Schedule + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl md:rounded-xl lg:rounded-2xl shadow-md p-4 md:p-5 lg:p-6">
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
            <div className="p-1 flex items-center gap-2 md:gap-2.5 lg:gap-3 mb-4 md:mb-5 lg:mb-6 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
                    className={`flex flex-col items-center justify-center ${isSelected ? 'py-4 md:py-4 lg:py-5 px-5 md:px-5 lg:px-6 scale-105' : 'py-2.5 md:py-2.5 lg:py-3 px-3 md:px-3.5 lg:px-4'} rounded-2xl min-w-14 md:min-w-14 lg:min-w-16 border transition-all duration-200 ${isSelected ? 'bg-orange-400 text-white shadow-lg border-orange-300 ring-2 ring-orange-200' : 'bg-gray-100 text-gray-700 border-transparent hover:bg-orange-50 hover:text-orange-500'}`}
                  >
                    <div className="text-[10px] md:text-[11px] lg:text-xs opacity-80">{shortDay}</div>
                    <div className={`font-semibold ${isSelected ? 'text-lg md:text-lg lg:text-xl' : 'text-base'}`}>{dayNum}</div>
                    {isToday && <div className={`mt-1 md:mt-1.5 lg:mt-2 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />}
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
                    <div key={index} className="grid grid-cols-[40px_12px_minmax(0,1fr)] md:grid-cols-[52px_13px_minmax(0,1fr)] lg:grid-cols-[64px_14px_minmax(0,1fr)] gap-1 md:gap-1.5 lg:gap-2 items-start animate-pulse">
                      <div className="pt-1 md:pt-1 lg:pt-2 flex justify-start">
                        <div className="h-2.5 md:h-3 lg:h-3 w-7 md:w-7 lg:w-8 rounded-full bg-gray-200" />
                      </div>

                      <div className="relative min-h-full min-w-0">
                        <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gray-200" />
                        <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-200" />
                      </div>

                      <div className="min-w-0">
                        <div className="rounded-2xl md:rounded-2xl lg:rounded-3xl px-3 md:px-4 lg:px-5 py-3 md:py-3.5 lg:py-4 shadow-sm border border-gray-200 bg-white">
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
                    <div className="grid grid-cols-[40px_12px_minmax(0,1fr)] md:grid-cols-[52px_13px_minmax(0,1fr)] lg:grid-cols-[64px_14px_minmax(0,1fr)] gap-1 md:gap-1.5 lg:gap-2 items-center">
                      <div className="flex justify-end">
                        <span className="inline-flex rounded-full bg-orange-400 px-2 md:px-2 lg:px-2.5 py-0.5 md:py-0.5 lg:py-0.5 text-[8px] md:text-[8px] lg:text-[9px] font-bold text-white shadow-sm z-30">
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
                  const isPending = appointment.status === "PENDING"

                  return (
                    <Fragment key={appointment.id}>
                      <div
                        ref={(el) => {
                          appointmentRowRefs.current[appointment.id] = el;
                        }}
                        className="relative z-10 grid grid-cols-[40px_12px_minmax(0,1fr)] md:grid-cols-[52px_13px_minmax(0,1fr)] lg:grid-cols-[64px_14px_minmax(0,1fr)] gap-1 md:gap-1.5 lg:gap-2 items-start"
                      >
                        <div className={`pt-1 md:pt-1.5 lg:pt-2 text-[9px] md:text-[10px] lg:text-[11px] font-semibold ${statusStyle.time}`}>{appointment.time}</div>

                        <div className="relative min-h-full min-w-0">
                          <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gray-300" />
                          <span className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 bg-white ${statusStyle.dot}`} />
                        </div>

                        <div className="min-w-0 pl-0.5 md:pl-1 lg:pl-1.5">
                          <div
                            ref={(el) => {
                              appointmentCardRefs.current[appointment.id] = el;
                            }}
                            onClick={() => openPendingAppointmentModal(appointment)}
                            className={`rounded-2xl md:rounded-2xl lg:rounded-3xl px-3 md:px-4 lg:px-5 py-3 md:py-3.5 lg:py-4 shadow-sm ${statusStyle.card} ${
                              isPending
                                ? "cursor-pointer transition hover:border-orange-300 hover:shadow-md"
                                : ""
                            }`}
                            style={
                              isCompleted
                                ? {
                                    backgroundColor: "transparent",
                                    borderColor: "#34d399",
                                  }
                                : undefined
                            }
                          >
                            <div className="mb-0.5 md:mb-1 lg:mb-1 flex items-start justify-between gap-1.5 md:gap-2 lg:gap-3 min-w-0">
                              <p className="flex-1 min-w-0 text-sm md:text-base lg:text-lg font-bold leading-tight text-gray-900 wrap-break-word">{appointment.customer}</p>
                              <span className={`shrink-0 rounded-full px-2 md:px-2 lg:px-2.5 py-0.5 md:py-0.5 lg:py-1 text-[7px] md:text-[8px] lg:text-[9px] font-bold tracking-widest whitespace-nowrap ${statusStyle.badge}`}>
                                {statusLabels[appointment.status] || appointment.status.replace("_", " ")}
                              </span>
                            </div>
                            <div className="mt-0.5 md:mt-1 lg:mt-1 flex items-center gap-1.5 md:gap-1.5 lg:gap-2 min-w-0 text-[11px] md:text-xs lg:text-xs text-gray-400">
                              <span className="min-w-0 flex-1 truncate">
                                {appointment.service}
                              </span>
                              <span className="shrink-0 rounded-full bg-orange-50 px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-0.5 lg:py-1 text-[9px] md:text-[9px] lg:text-[10px] font-semibold text-orange-500 whitespace-nowrap">
                                {appointment.timeMinutes}
                              </span>
                            </div>
                            <div className="my-2 md:my-2.5 lg:my-3 h-px bg-gray-300" />
                            <div className="flex items-center gap-1.5 md:gap-1.5 lg:gap-2 text-[11px] md:text-xs lg:text-xs text-gray-400 min-w-0">
                              <span className="h-5 w-5 md:h-5 md:w-5 lg:h-6 lg:w-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-[8px] md:text-[9px] lg:text-[10px] font-semibold">
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

      {selectedPendingAppointment && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={closePendingAppointmentModal}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-3xl border border-orange-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.25)]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t("history.status.pending")}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-500">
                  {t("history.status.pending")}
                </span>
                <h3 className="mt-2 text-lg font-bold text-slate-900">
                  {selectedPendingAppointment.customer}
                </h3>
                <p className="mt-0.5 text-xs font-medium text-slate-600">
                  {selectedPendingAppointment.service}
                </p>
              </div>

              <button
                type="button"
                onClick={closePendingAppointmentModal}
                disabled={isUpdatingBookingStatus}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                aria-label={t("common.cancel")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/80 p-3">
              <div className="grid grid-cols-[1fr_auto] gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("admin.schedule.title") || "Schedule"}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-900">
                    {selectedPendingAppointment.timeRange}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {t("history.status.pending")}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-orange-500">
                    {selectedPendingAppointment.status}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {t("admin.dashboard.panel") || "Details"}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-slate-700">
                {selectedPendingAppointment.customer} - {selectedPendingAppointment.service}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => updatePendingAppointmentStatus("CANCELLED")}
                disabled={isUpdatingBookingStatus}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 disabled:opacity-60"
              >
                <CircleX className="h-3.5 w-3.5" />
                {isCancellingBooking ? t("common.loading") : t("admin.bookingModal.cancelAction")}
              </button>
              <button
                type="button"
                onClick={() => updatePendingAppointmentStatus("COMPLETED")}
                disabled={isUpdatingBookingStatus}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-500 px-3 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.3)] transition hover:bg-green-600 disabled:opacity-60"
              >
                <CircleCheckBig className="h-3.5 w-3.5" />
                {isCompletingBooking ? t("common.loading") : t("admin.bookingModal.completeAction")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
