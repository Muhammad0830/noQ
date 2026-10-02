"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Route } from "next";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CircleUser,
  ClipboardList,
  DollarSign,
  History,
  PlusCircle,
  Scissors,
  Users,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useApiMutation } from "@/hooks/useApiMutation";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import AdminSidebar from "@/components/AdminSidebar";
import AdminDashboardHeader from "@/components/admin/AdminDashboardHeader";
import DashboardMetricCard from "@/components/admin/DashboardMetricCard";
import {
  AdminScheduleTimeline,
  type AdminDashboardBooking,
  type TimelineAppointment,
} from "@/components/admin/AdminScheduleTimeline";
import { Shop } from "@shared/types/general_types";
import { useTranslations } from "next-intl";

const asRoute = (href: string) => href as Route;

type DashboardBaseInfoResponse = {
  sevenDayBookingsCount: number;
  prevSevenDayBookingsCount: number;
  bookingsCountChange: number;
  staffCount: number;
  currentRevenue: number;
  prevRevenue: number;
  revenueChange: number;
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
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [persistedShopId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem("selected_shop_id");
  });
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isSidebarClosing, setIsSidebarClosing] = useState(false);
  const sidebarCloseTimerRef = useRef<number | null>(null);
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [selectedPendingAppointment, setSelectedPendingAppointment] =
    useState<TimelineAppointment | null>(null);

  const shopId = searchParams.get("shopId");
  const selectedShopHint = shopId || persistedShopId;

  const isAdmin = user?.role === "ADMIN";
  const { data: shopsResponse, isLoading: isLoadingShopsFallback } =
    useApiQuery<ShopsResponse>(isAdmin ? API_ENDPOINTS.shops : null, {
      key: ["admin-shops-fallback", user?.id || "guest"],
      enabled: Boolean(
        isAdmin &&
        user?.id &&
        (!(user?.shops && user.shops.length > 0) ||
          Boolean(
            selectedShopHint &&
            !(user?.shops || []).some((shop) => shop.id === selectedShopHint),
          )),
      ),
      staleTime: 30_000,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

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
  }, [shopsResponse, user]);

  const activeShopId = useMemo(() => {
    if (shopId) return shopId;
    if (persistedShopId) return persistedShopId;
    if (user?.shops?.[0]?.id) return user.shops[0].id;
    if (adminShops[0]?.id) return adminShops[0].id;
    return null;
  }, [adminShops, persistedShopId, shopId, user]);

  useEffect(() => {
    if (!activeShopId || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId]);

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

  const closeSidebar = useCallback(() => {
    if (!isSidebarVisible || isSidebarClosing) return;
    setIsSidebarClosing(true);
    sidebarCloseTimerRef.current = window.setTimeout(() => {
      setIsSidebarVisible(false);
      setIsSidebarClosing(false);
      sidebarCloseTimerRef.current = null;
    }, 280);
  }, [isSidebarClosing, isSidebarVisible]);

  useEffect(() => {
    if (!isSidebarVisible && !isSidebarClosing) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeSidebar, isSidebarClosing, isSidebarVisible]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const shouldLockScroll = isSidebarVisible && !isSidebarClosing;
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";

    return () => {
      if (shouldLockScroll) {
        document.body.style.overflow = "";
      }
    };
  }, [isSidebarClosing, isSidebarVisible]);

  useEffect(
    () => () => {
      if (sidebarCloseTimerRef.current) {
        window.clearTimeout(sidebarCloseTimerRef.current);
      }
    },
    [],
  );

  const adminNavItems = [
    {
      title: t("bottomNav.panel"),
      href: getAdminHrefWithShopId("/admin"),
      icon: BarChart3,
      exact: true,
    },
    {
      title: t("bottomNav.analytics"),
      href: getAdminHrefWithShopId("/admin/analytics"),
      icon: ClipboardList,
    },
    {
      title: t("bottomNav.schedule"),
      href: getAdminHrefWithShopId("/admin/schedule"),
      icon: CalendarDays,
    },
    {
      title: t("bottomNav.services"),
      href: getAdminHrefWithShopId("/admin/services"),
      icon: Scissors,
    },
    {
      title: t("bottomNav.history"),
      href: getAdminHrefWithShopId("/admin/history"),
      icon: History,
    },
    {
      title: t("bottomNav.staff"),
      href: getAdminHrefWithShopId("/admin/staff"),
      icon: Users,
    },
    {
      title: t("bottomNav.profile"),
      href: "/profile",
      icon: CircleUser,
    },
  ];

  const resolvedCurrentShop = useMemo(() => {
    if (!user) return null;

    if (activeShopId) {
      const foundInUser = (user.shops || []).find(
        (shop: Shop) => shop.id === activeShopId,
      );
      const foundInFallback = adminShops.find(
        (shop) => shop.id === activeShopId,
      );
      return foundInUser || foundInFallback || null;
    }

    return user.shops?.[0] || adminShops[0] || null;
  }, [activeShopId, adminShops, user]);

  const currentShopName =
    resolvedCurrentShop?.name || t("admin.dashboard.panel");
  const isShopNameLoading = useMemo(() => {
    if (!activeShopId) return false;
    if (resolvedCurrentShop?.name) return false;
    return isLoadingShopsFallback;
  }, [activeShopId, isLoadingShopsFallback, resolvedCurrentShop?.name]);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const currentTimeLabel = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const revenue = useMemo(
    () => formatPrice(baseInfo?.currentRevenue ?? 0),
    [baseInfo?.currentRevenue],
  );
  const bookingsCount = baseInfo?.sevenDayBookingsCount ?? 0;
  const bookingsCountChange = baseInfo?.bookingsCountChange ?? 0;
  const staffCount = baseInfo?.staffCount ?? 0;
  const revenueChange = baseInfo?.revenueChange ?? 0;
  const revenueChangeText = `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% ${t("admin.dashboard.period7d")}`;
  const bookingsChangeText = `${bookingsCountChange >= 0 ? "+" : ""}${bookingsCountChange.toFixed(1)}% ${t("admin.dashboard.period7d")}`;

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
      key: [
        "admin-dashboard-history",
        activeShopId || "none",
        selectedDateQuery,
      ],
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

  const formatTime = (value: string) => {
    const date = parseBackendWallClockDate(value);
    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
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

    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}m`;
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

  const timelineAppointments: TimelineAppointment[] = [...historyBookings]
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
        timeRange: `${formatTime(booking.startTime)} - ${formatTime(booking.endTime)}`,
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

      setSelectedPendingAppointment(null);
      refetchHistory();
    } catch {
      // handled by useApiMutation toast
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

  return (
    <div className="bg-gray-50 pb-4 sm:pb-24">
      <AdminDashboardHeader
        currentShopName={currentShopName}
        isShopNameLoading={isShopNameLoading}
        onOpenSidebar={openSidebar}
        panelLabel={t("admin.dashboard.panel")}
      />

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
            {t("admin.dashboard.error.baseInfoPrefix", {
              message: baseInfoErrorMessage,
            })}
          </div>
        )}

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:gap-6">
          <div className="grid flex-1 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-2 lg:gap-4">
            <DashboardMetricCard
              label={t("admin.dashboard.revenue")}
              value={revenue}
              changeText={revenueChangeText}
              changePositive={revenueChange >= 0}
              icon={DollarSign}
              iconClassName="bg-orange-400"
              isLoading={isBaseInfoLoading}
            />
            <DashboardMetricCard
              label={t("admin.dashboard.bookings")}
              value={bookingsCount}
              changeText={bookingsChangeText}
              changePositive={bookingsCountChange >= 0}
              icon={BarChart3}
              iconClassName="bg-blue-500"
              isLoading={isBaseInfoLoading}
            />
          </div>

          <div className="flex w-full flex-row items-center gap-2 md:w-auto md:min-w-max md:gap-3 lg:ml-4 lg:gap-4">
            <button
              type="button"
              onClick={() => {
                const year = selectedDate.getFullYear();
                const month = String(selectedDate.getMonth() + 1).padStart(
                  2,
                  "0",
                );
                const day = String(selectedDate.getDate()).padStart(2, "0");
                const dateValue = `${year}-${month}-${day}`;
                const base = getAdminHrefWithShopId("/admin/bookings/new");
                const joiner = base.includes("?") ? "&" : "?";
                router.push(
                  asRoute(
                    `${base}${joiner}date=${encodeURIComponent(dateValue)}`,
                  ),
                );
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-orange-400 px-3 py-2.5 text-white shadow-lg md:flex-none md:px-3 md:py-2.5 lg:gap-3 lg:px-4 lg:py-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white md:h-6 md:w-6 lg:h-8 lg:w-8">
                <PlusCircle className="h-3.5 w-3.5 text-orange-400 md:h-4 md:w-4" />
              </span>
              <span className="text-center text-[9px] font-semibold uppercase leading-tight md:text-[10px] lg:text-xs">
                {t("admin.dashboard.newAppointment")}
              </span>
            </button>

            <Link
              href={asRoute(getAdminHrefWithShopId("/admin/staff"))}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2.5 shadow md:flex-none md:px-3 md:py-2.5 lg:gap-3 lg:px-4 lg:py-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white md:h-6 md:w-6 lg:h-10 lg:w-10">
                <Users className="h-3.5 w-3.5 text-orange-400 md:h-4 md:w-4" />
              </span>
              <span className="text-center text-[9px] font-semibold uppercase leading-tight md:text-[10px] lg:text-xs">
                {t("admin.dashboard.staff")} (
                {isBaseInfoLoading ? "..." : staffCount})
              </span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6">
          <AdminScheduleTimeline
            currentDate={currentDate}
            selectedDate={selectedDate}
            selectedMonthDate={selectedMonthDate}
            now={now}
            appointments={timelineAppointments}
            isLoading={isHistoryLoading}
            isError={isHistoryError}
            errorMessage={historyErrorMessage}
            currentTimeLabel={currentTimeLabel}
            getAdminHrefWithShopId={getAdminHrefWithShopId}
            isUpdatingBookingStatus={isUpdatingBookingStatus}
            isCompletingBooking={isCompletingBooking}
            isCancellingBooking={isCancellingBooking}
            selectedPendingAppointment={selectedPendingAppointment}
            onSelectDate={(date) => setSelectedDate(date)}
            onSelectMonth={(date) => setSelectedMonthDate(date)}
            onOpenPendingAppointment={openPendingAppointmentModal}
            onClosePendingAppointment={closePendingAppointmentModal}
            onUpdatePendingAppointmentStatus={updatePendingAppointmentStatus}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
