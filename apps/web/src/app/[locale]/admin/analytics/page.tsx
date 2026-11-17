"use client";

import { useMemo, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import AnalyticsRevenueChart from "@/components/admin/analytics/AnalyticsRevenueChart";
import { useAdminAnalytics } from "@/hooks/admin/useAdminAnalytics";
import { getAvailableIntervals } from "@/utils/analytics";
import AnalyticsSelectTabSection from "@/components/admin/analytics/AnalyticsSelectTabSection";
import AnalyticsBaseInfoSection from "@/components/admin/analytics/AnalyticsBaseInfoSection";
import AnalyticsFamousServicesSection from "@/components/admin/analytics/AnalyticsFamousServicesSection";
import AnalyticsPeakHoursSection from "@/components/admin/analytics/AnalyticsPeakHoursSection";
import {
  IntervalType,
  startOfDay,
  subDays,
  subMonths,
  subYears
} from "@noq/shared";

type TabsType = "last_week" | "last_month" | "last_year"

const analyticsTabs: TabsType[] = ["last_week", "last_month", "last_year"];

export default function ShopAnalytics() {
  const { shop } = useShop()

  const [startTime, setStartTime] = useState(subDays(startOfDay(new Date()), 7));
  const [endTime, setEndTime] = useState(startOfDay(new Date()));
  const [interval, setInterval] = useState<IntervalType>('day')
  const [activeTab, setActiveTab] = useState<TabsType | null>("last_week")

  const { canSelectMonth, canSelectYear } = useMemo(
    () => getAvailableIntervals(startTime, endTime),
    [startTime, endTime],
  );

  const effectiveInterval = useMemo<IntervalType>(() => {
    if (interval === "year" && !canSelectYear) {
      return canSelectMonth ? "month" : "day";
    }

    if (interval === "month" && !canSelectMonth) {
      return "day";
    }

    return interval;
  }, [interval, canSelectMonth, canSelectYear]);

  const {
    analyticsSummary,
    isSummaryLoading,
    isSummaryError,
    summaryError,

    diagramInfo,
    isDiagramLoading,
    isDiagramError,
    diagramError,

    famousServices,
    isServicesLoading,
    isServicesError,
    servicesError,

    peakHours,
    isPeakHoursLoading,
    isPeakHoursError,
    peakHoursError,
  } = useAdminAnalytics({
    shopId: shop?.id,
    startTime: startTime,
    endTime: endTime,
    interval: effectiveInterval,
  });

  const handleSelectTab = (tab: TabsType) => {
    setActiveTab(tab);

    const end = startOfDay(new Date());

    let start: Date;
    let selectedInterval: IntervalType;

    switch (tab) {
      case "last_week":
        start = subDays(end, 7);
        selectedInterval = "day";
        break;
      case "last_month":
        start = subMonths(end, 1);
        selectedInterval = "day";
        break;
      case "last_year":
        start = subYears(end, 1);
        selectedInterval = "month";
        break
    }

    setStartTime(start);
    setEndTime(end);
    setInterval(selectedInterval)
  }

  const handleSelectTime = (startTime: Date, endTime: Date) => {
    setStartTime(startTime);
    setEndTime(endTime);
    setActiveTab(null)
  }

  return (
    <div className="min-h-screen bg-[#f5f4f2] text-[#111111] pb-20 flex w-full flex-col gap-4 md:gap-5 lg:gap-6 px-4 pt-4 md:pt-5 lg:pt-6">
      <AnalyticsSelectTabSection
        activeTab={activeTab}
        analyticsTabs={analyticsTabs}
        startTime={startTime}
        endTime={endTime}
        onSelectTab={handleSelectTab}
        onSelectTime={handleSelectTime}
      />

      <AnalyticsBaseInfoSection
        data={analyticsSummary}
        isLoading={isSummaryLoading}
        isError={isSummaryError}
        error={summaryError}
      />

      <AnalyticsRevenueChart
        points={diagramInfo.data}
        isLoading={isDiagramLoading}
        interval={effectiveInterval}
        setInterval={setInterval}
        canSelectMonth={canSelectMonth}
        canSelectYear={canSelectYear}
        isError={isDiagramError}
        error={diagramError}
      />

      <AnalyticsFamousServicesSection
        data={famousServices}
        isLoading={isServicesLoading}
        isError={isServicesError}
        error={servicesError}
      />

      <AnalyticsPeakHoursSection
        data={peakHours}
        isLoading={isPeakHoursLoading}
        isError={isPeakHoursError}
        error={peakHoursError}
      />
    </div >
  );
}
