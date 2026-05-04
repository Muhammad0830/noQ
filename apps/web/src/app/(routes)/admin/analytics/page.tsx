"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Bell, CalendarDays, Star, Settings, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import AdminSidebar from "@/components/AdminSidebar";
import { useAdminSidebar } from "@/hooks/useAdminSidebar";

type AnalyticsType = "week" | "month" | "year";

type AnalyticsSummaryResponse = {
  currentRevenue: number;
  prevRevenue?: number;
  revenueChange?: number;
  currentBookingsCount: number;
  prevBookingsCount?: number;
  bookingsNumberChange?: number;
  currentAverageRating: number;
  prevAverageRating?: number;
  averageRatingChange?: number;
};

type DiagramInfoResponse = {
  type: AnalyticsType;
  data: {
    date: string;
    revenue: number;
  }[];
};

type FamousServiceItem = {
  id: string;
  name: string;
  booking_count: number;
  averageRating: number;
};

type FamousServicesResponse = {
  type: AnalyticsType;
  data: FamousServiceItem[];
};

type PeakHoursResponse = Record<string, number>;

const analyticsTabTypes: AnalyticsType[] = ["week", "month", "year"];

function MetricCard({
  icon,
  label,
  value,
  change,
  changeClassName,
  isLoading = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  change: string;
  changeClassName: string;
  isLoading?: boolean;
}) {
  return (
    <div className="rounded-[22px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fff2df] text-[#f3a137]">
          {icon}
        </div>
        {isLoading ? (
          <span className="h-4 w-12 animate-pulse rounded-full bg-gray-200" />
        ) : (
          <span className={`text-[11px] font-semibold ${changeClassName}`}>
            {change}
          </span>
        )}
      </div>
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c2c2c2]">
        {label}
      </p>
      {isLoading ? (
        <div className="h-8 w-16 animate-pulse rounded-xl bg-gray-200" />
      ) : (
        <p className="text-[30px] font-bold tracking-tight text-[#111111]">
          {value}
        </p>
      )}
    </div>
  );
}

function AnalyticsRevenueChart({
  points,
  title,
  invalidDateLabel,
  isLoading,
}: {
  points: { date: string; revenue: number }[];
  title: string;
  invalidDateLabel: string;
  isLoading: boolean;
}) {
  const chartPoints = useMemo(() => {
    if (!points.length) {
      return [{ date: new Date().toISOString(), revenue: 0 }];
    }

    return points;
  }, [points]);

  const { polylinePoints, areaPath, dot, labels } = useMemo(() => {
    const width = 320;
    const height = 160;
    const paddingX = 18;
    const paddingY = 18;

    const maxRevenue = Math.max(...chartPoints.map((item) => item.revenue), 1);

    const normalized = chartPoints.map((item, index) => {
      const x =
        chartPoints.length === 1
          ? width / 2
          : paddingX +
            (index * (width - paddingX * 2)) / (chartPoints.length - 1);
      const y =
        height -
        paddingY -
        (item.revenue / maxRevenue) * (height - paddingY * 2);
      return { x, y };
    });

    const line = normalized.map((point) => `${point.x},${point.y}`).join(" ");
    const fill = `${normalized.map((point) => `${point.x},${point.y}`).join(" ")} ${width - paddingX},${height - paddingY} ${paddingX},${height - paddingY}`;

    const activeIndex = normalized.length - 1;
    const activeDot = normalized[activeIndex];

    const labelCount = Math.min(7, chartPoints.length);
    const labelIndices = new Set<number>(
      Array.from({ length: labelCount }, (_, i) =>
        Math.round(
          (i * (chartPoints.length - 1)) / Math.max(labelCount - 1, 1),
        ),
      ),
    );

    const sortedLabelIndices = Array.from(labelIndices).sort((a, b) => a - b);

    const xLabels = sortedLabelIndices.map((index) => {
      const date = new Date(chartPoints[index]?.date);
      if (Number.isNaN(date.getTime())) return invalidDateLabel;

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${day}.${month}`;
    });

    return {
      polylinePoints: line,
      areaPath: fill,
      dot: activeDot,
      labels: xLabels,
    };
  }, [chartPoints, invalidDateLabel]);

  if (isLoading) {
    return (
      <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
        <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-200" />
        <div className="h-52 animate-pulse rounded-3xl bg-gray-100" />
      </div>
    );
  }

  const activeRevenue = chartPoints[chartPoints.length - 1]?.revenue ?? 0;

  return (
    <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
      <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[#111111]">
        <span className="h-2 w-2 rounded-full bg-[#f39c33]" />
        {title}
      </div>

      <div className="relative overflow-hidden rounded-4xl bg-linear-to-b from-[#fff8ef] to-[#fffdf8] px-2 py-4">
        <svg viewBox="0 0 320 180" className="h-47.5 w-full overflow-visible">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7a03a" stopOpacity="0.26" />
              <stop offset="100%" stopColor="#f7a03a" stopOpacity="0.02" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="8"
                stdDeviation="8"
                floodColor="#f39c33"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          <path d={`M ${areaPath} Z`} fill="url(#revenueFill)" />

          <polyline
            points={polylinePoints}
            fill="none"
            stroke="#f39c33"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#shadow)"
          />

          <circle
            cx={dot.x}
            cy={dot.y}
            r="5"
            fill="#f39c33"
            stroke="#fff"
            strokeWidth="4"
          />

          <g transform={`translate(${dot.x - 22}, ${dot.y - 34})`}>
            <rect x="0" y="0" width="72" height="22" rx="11" fill="#f39c33" />
            <polygon points="28,22 34,22 31,28" fill="#f39c33" />
            <text
              x="32"
              y="15"
              textAnchor="middle"
              className="fill-white text-[10px] font-semibold"
            >
              ${Math.round(activeRevenue)}
            </text>
          </g>
        </svg>

        <div className="-mt-2 flex items-center justify-between gap-2 text-[10px] font-semibold text-[#8b8b8b]">
          {labels.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className={index === labels.length - 1 ? "text-[#f39c33]" : ""}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ShopAnalytics() {
  const { user } = useAuth();
  const { t, locale } = useLanguage();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);
  const [persistedShopId, setPersistedShopId] = useState<string | null>(null);
  const [hasLoadedPersistedShop, setHasLoadedPersistedShop] = useState(false);

  const shopId = searchParams.get("shopId");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedShopId = window.localStorage.getItem("selected_shop_id");
    if (savedShopId) {
      setPersistedShopId(savedShopId);
    }
    setHasLoadedPersistedShop(true);
  }, []);

  const activeShopId = useMemo(() => {
    if (!hasLoadedPersistedShop) return null;

    const userShops = user?.shops || [];

    if (shopId && userShops.some((shop) => shop.id === shopId)) return shopId;
    if (
      persistedShopId &&
      userShops.some((shop) => shop.id === persistedShopId)
    ) {
      return persistedShopId;
    }

    return userShops[0]?.id || null;
  }, [hasLoadedPersistedShop, persistedShopId, shopId, user?.shops]);

  const {
    isSidebarVisible,
    isSidebarClosing,
    openSidebar,
    closeSidebar,
    adminNavItems,
    getAdminHrefWithShopId,
  } = useAdminSidebar(activeShopId);

  const tabs = useMemo(
    () =>
      analyticsTabTypes.map((type) => ({
        type,
        label: t(`admin.analytics.filter.${type}`),
      })),
    [t],
  );

  const selectedType = tabs[activeTab]?.type || "week";

  const analyticsHeaders = activeShopId
    ? { "x-shopid": activeShopId, "x-shop-id": activeShopId }
    : undefined;

  useEffect(() => {
    if (
      !hasLoadedPersistedShop ||
      !activeShopId ||
      typeof window === "undefined"
    )
      return;
    window.localStorage.setItem("selected_shop_id", activeShopId);
  }, [activeShopId, hasLoadedPersistedShop]);

  const currentShopName = useMemo(() => {
    if (!hasLoadedPersistedShop) return t("admin.dashboard.panel");
    if (!user) return t("admin.dashboard.panel");

    if (activeShopId) {
      const activeShop = (user.shops || []).find(
        (shop) => shop.id === activeShopId,
      );
      return activeShop?.name || t("admin.dashboard.panel");
    }

    return user.shops?.[0]?.name || t("admin.dashboard.panel");
  }, [activeShopId, hasLoadedPersistedShop, t, user]);

  const {
    data: analyticsSummary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    error: summaryError,
  } = useApiQuery<AnalyticsSummaryResponse>(
    activeShopId
      ? `${API_ENDPOINTS.admin.analytics}?type=${selectedType}`
      : null,
    {
      key: ["admin-analytics-summary", activeShopId || "none", selectedType],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      headers: analyticsHeaders,
    },
  );

  const {
    data: diagramInfo,
    isLoading: isDiagramLoading,
    isError: isDiagramError,
    error: diagramError,
  } = useApiQuery<DiagramInfoResponse>(
    activeShopId
      ? `${API_ENDPOINTS.admin.analyticsDiagramInfo}?type=${selectedType}`
      : null,
    {
      key: ["admin-analytics-diagram", activeShopId || "none", selectedType],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      headers: analyticsHeaders,
    },
  );

  const {
    data: famousServices,
    isLoading: isServicesLoading,
    isError: isServicesError,
    error: servicesError,
  } = useApiQuery<FamousServicesResponse>(
    activeShopId
      ? `${API_ENDPOINTS.admin.analyticsFamousServices}?type=${selectedType}`
      : null,
    {
      key: ["admin-analytics-services", activeShopId || "none", selectedType],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      headers: analyticsHeaders,
    },
  );

  const {
    data: peakHours,
    isLoading: isPeakHoursLoading,
    isError: isPeakHoursError,
    error: peakHoursError,
  } = useApiQuery<PeakHoursResponse>(
    activeShopId
      ? `${API_ENDPOINTS.admin.analyticsPeakHours}?type=${selectedType}`
      : null,
    {
      key: ["admin-analytics-peak-hours", activeShopId || "none", selectedType],
      enabled: Boolean(activeShopId && user),
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      headers: analyticsHeaders,
    },
  );

  const summaryErrorMessage =
    (summaryError?.data &&
      typeof summaryError.data === "object" &&
      "message" in summaryError.data &&
      typeof (summaryError.data as { message?: unknown }).message ===
        "string" &&
      (summaryError.data as { message: string }).message) ||
    summaryError?.message ||
    t("admin.analytics.error.summaryFallback");

  const diagramErrorMessage =
    (diagramError?.data &&
      typeof diagramError.data === "object" &&
      "message" in diagramError.data &&
      typeof (diagramError.data as { message?: unknown }).message ===
        "string" &&
      (diagramError.data as { message: string }).message) ||
    diagramError?.message ||
    t("admin.analytics.error.diagramFallback");

  const servicesErrorMessage =
    (servicesError?.data &&
      typeof servicesError.data === "object" &&
      "message" in servicesError.data &&
      typeof (servicesError.data as { message?: unknown }).message ===
        "string" &&
      (servicesError.data as { message: string }).message) ||
    servicesError?.message ||
    t("admin.analytics.error.servicesFallback");

  const peakHoursErrorMessage =
    (peakHoursError?.data &&
      typeof peakHoursError.data === "object" &&
      "message" in peakHoursError.data &&
      typeof (peakHoursError.data as { message?: unknown }).message ===
        "string" &&
      (peakHoursError.data as { message: string }).message) ||
    peakHoursError?.message ||
    t("admin.analytics.error.peakHoursFallback");

  const revenue = analyticsSummary?.currentRevenue ?? 0;
  const revenueText = new Intl.NumberFormat(locale || undefined, {
    style: "currency",
    currency: "UZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(revenue);

  const revenueChange = analyticsSummary?.revenueChange ?? 0;
  const bookingsCount = analyticsSummary?.currentBookingsCount ?? 0;
  const bookingsChange = analyticsSummary?.bookingsNumberChange ?? 0;
  const rating = analyticsSummary?.currentAverageRating ?? 0;
  const ratingChange = analyticsSummary?.averageRatingChange ?? 0;

  const topServices = useMemo(() => {
    const data = famousServices?.data || [];
    const maxBookings = Math.max(...data.map((item) => item.booking_count), 1);

    return data.slice(0, 5).map((service) => ({
      ...service,
      width: Math.max(
        6,
        Math.round((service.booking_count / maxBookings) * 100),
      ),
    }));
  }, [famousServices?.data]);

  const peakHoursData = useMemo(() => {
    const entries = Object.entries(peakHours || {}).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    const maxCount = Math.max(...entries.map(([, value]) => value), 0);
    const activeHour =
      maxCount > 0
        ? entries.find(([, value]) => value === maxCount)?.[0]
        : null;

    return entries.map(([hour, value], index) => ({
      hour,
      value,
      height:
        maxCount === 0 ? 16 : Math.max(16, Math.round((value / maxCount) * 92)),
      active: hour === activeHour,
      label: index % 4 === 0 ? hour : "",
    }));
  }, [peakHours]);

  const shopInitials = (currentShopName || "A")
    .split(" ")
    .map((word: string) => word[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="min-h-screen bg-[#f5f4f2] pb-8 text-[#111111]">
      <AdminSidebar
        isVisible={isSidebarVisible}
        isClosing={isSidebarClosing}
        currentShopName={currentShopName}
        adminNavItems={adminNavItems}
        onClose={closeSidebar}
        getAdminHrefWithShopId={getAdminHrefWithShopId}
      />

      <div className="sticky top-0 z-40 w-full">
        <div className="mx-auto flex w-full max-w-107.5 items-center justify-between border-b bg-orange-50 p-3 md:bg-white md:shadow-sm md:p-4 lg:p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 md:h-11 md:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600">
              {shopInitials}
            </div>
            <div>
              <div className="text-sm font-semibold">{currentShopName}</div>
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
              onClick={openSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 shadow"
              aria-label="Open admin sidebar"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-107.5 flex-col gap-4 md:gap-5 lg:gap-6 px-4 pt-4 md:pt-5 lg:pt-6">
        {!activeShopId && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {t("admin.dashboard.shopNotFound")}
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 md:gap-2.5 lg:gap-3">
          {tabs.map((tab, index) => (
            <button
              key={tab.type}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`w-full rounded-full px-2 py-2 md:py-2.5 lg:py-2.5 text-[9px] md:text-[10px] lg:text-[10px] font-semibold transition ${
                activeTab === index
                  ? "bg-[#f39c33] text-white shadow-[0_10px_24px_rgba(243,156,51,0.32)]"
                  : "bg-white text-[#7b7b7b] shadow-[0_10px_24px_rgba(15,17,21,0.05)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isSummaryError && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {summaryErrorMessage}
          </div>
        )}

        <div className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <div className="mb-2 md:mb-3 lg:mb-4 flex items-center justify-between">
            <p className="text-[9px] md:text-[10px] lg:text-[10px] font-bold uppercase tracking-[0.28em] text-[#bdbdbd]">
              {t("admin.analytics.totalRevenue")}
            </p>
            {isSummaryLoading ? (
              <span className="h-6 w-14 md:w-16 lg:w-16 animate-pulse rounded-full bg-gray-200" />
            ) : (
              <span
                className={`rounded-full px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-semibold ${
                  revenueChange >= 0
                    ? "bg-[#fff1df] text-[#f39c33]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {revenueChange >= 0 ? "+" : ""}
                {revenueChange.toFixed(1)}%
              </span>
            )}
          </div>

          <div className="flex items-end gap-2">
            {isSummaryLoading ? (
              <div className="h-10 md:h-11 lg:h-11 w-40 md:w-44 lg:w-44 animate-pulse rounded-2xl bg-gray-200" />
            ) : (
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-none tracking-tight text-[#111111] break-words line-clamp-2">
                {revenueText}
              </h2>
            )}
            <span className="pb-1 text-[11px] md:text-[12px] lg:text-[12px] font-semibold text-[#9a9a9a]">
              {t("admin.analytics.currency")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-3.5 lg:gap-4">
          <MetricCard
            icon={<CalendarDays className="h-4 w-4" />}
            label={t("admin.analytics.bookings")}
            value={String(bookingsCount)}
            change={`${bookingsChange >= 0 ? "+" : ""}${bookingsChange.toFixed(1)}%`}
            changeClassName={
              bookingsChange >= 0 ? "text-[#5d8dff]" : "text-red-600"
            }
            isLoading={isSummaryLoading}
          />

          <MetricCard
            icon={<Star className="h-4 w-4 fill-[#f39c33] text-[#f39c33]" />}
            label={t("admin.analytics.rating")}
            value={rating.toFixed(1)}
            change={`${ratingChange >= 0 ? "+" : ""}${ratingChange.toFixed(1)}`}
            changeClassName={
              ratingChange >= 0 ? "text-[#f39c33]" : "text-red-600"
            }
            isLoading={isSummaryLoading}
          />
        </div>

        {isDiagramError && (
          <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {diagramErrorMessage}
          </div>
        )}

        <AnalyticsRevenueChart
          points={diagramInfo?.data || []}
          title={t("admin.analytics.dailyRevenueTrends")}
          invalidDateLabel={t("admin.analytics.invalidDateLabel")}
          isLoading={isDiagramLoading}
        />

        <section className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <h3 className="mb-4 md:mb-5 lg:mb-6 text-[12px] md:text-[13px] lg:text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
            {t("admin.analytics.mostPopularServices")}
          </h3>

          {isServicesError && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {servicesErrorMessage}
            </div>
          )}

          {isServicesLoading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
                  <div className="h-1.5 animate-pulse rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          )}

          {!isServicesLoading && topServices.length > 0 && (
            <div className="space-y-4">
              {topServices.map((service) => (
                <div key={service.id}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-[11px] md:text-[12px] lg:text-[12px]">
                    <div className="font-medium text-[#1a1a1a]">
                      {service.name}
                    </div>
                    <div className="text-[#8f8f8f]">
                      {t("admin.analytics.servicesBookings", {
                        count: service.booking_count,
                      })}
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#f1e3d0]">
                    <div
                      className="h-full rounded-full bg-[#f4a341]"
                      style={{ width: `${service.width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isServicesLoading && !topServices.length && (
            <div className="text-sm text-gray-500">
              {t("admin.analytics.noServicesForPeriod")}
            </div>
          )}
        </section>

        <section className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
          <div className="mb-4 md:mb-5 lg:mb-6 flex items-center justify-between">
            <h3 className="text-[12px] md:text-[13px] lg:text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
              {t("admin.analytics.peakHours")}
            </h3>
          </div>

          {isPeakHoursError && (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {peakHoursErrorMessage}
            </div>
          )}

          {isPeakHoursLoading && (
            <div className="mb-3 flex items-end gap-1 md:gap-1.5 lg:gap-1.5">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-14 md:h-16 lg:h-16 flex-1 animate-pulse rounded-md bg-gray-200"
                />
              ))}
            </div>
          )}

          {!isPeakHoursLoading && (
            <div className="mb-3 flex items-end gap-0.5 md:gap-1 lg:gap-1">
              {peakHoursData.map((slot) => (
                <div
                  key={`${slot.hour}-${slot.value}`}
                  className={`flex-1 rounded-md ${slot.active ? "bg-[#f39c33]" : "bg-[#f8c877]"}`}
                  style={{ height: `${slot.height}px` }}
                  title={t("admin.analytics.peakHourTitle", {
                    hour: slot.hour,
                    count: slot.value,
                  })}
                />
              ))}
            </div>
          )}

          {!isPeakHoursLoading && (
            <div className="flex justify-between text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-[#7d7d7d]">
              {peakHoursData.map((slot, index) => (
                <span
                  key={`${slot.hour}-${index}`}
                  className={slot.label ? "min-w-6 md:min-w-7 lg:min-w-7" : "min-w-0 md:min-w-1 lg:min-w-1"}
                >
                  {slot.label}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
