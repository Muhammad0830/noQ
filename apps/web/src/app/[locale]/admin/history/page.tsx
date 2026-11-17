"use client";

import { useState } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { useTranslations } from "next-intl";
import { AdminHistoryBookingData, differenceInMilliseconds, formatToDateString, startOfDay } from "@noq/shared";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { useShop } from "@/contexts/ShopContext";
import { format } from "date-fns";
import { downloadCsv } from "@/services/downloadCsv";
import { statusLabels } from "@/features/booking/utils";
import HistoryBookingList from "@/components/admin/history/HistoryBookingList";
import HistoryBookingCsvExport from "@/components/admin/history/HistoryBookingCsvExport";

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

  const handleExportCsv = () => {
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
        t(statusLabels[item.status]),
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

  return (
    <div className="h-dvh bg-white overflow-hidden">
      <div className="flex h-full w-full flex-col bg-white">
        <main className="flex min-h-0 flex-1 flex-col gap-4 px-3 pt-3 pb-32 sm:px-4 md:pb-6">
          <ScheduleDatePicker
            selectedDate={selectedDate}
            setSelectedDate={(date) => setSelectedDate(date)}
            show="prev_only"
          />

          <HistoryBookingList
            bookings={bookings.data}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />

          <HistoryBookingCsvExport
            bookings={bookings.data}
            isExporting={isExporting}
            isExportDone={exportDone}
            handleExportCsv={handleExportCsv}
          />
        </main>
      </div>
    </div>
  );
}
