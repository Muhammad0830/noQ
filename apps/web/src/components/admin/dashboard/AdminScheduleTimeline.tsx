"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  SquareArrowOutUpRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { DashboardBookingItem } from "@noq/shared";
import { monthNames, weekdayShort } from "@/lib/utils";
import DashboardTimeLineSkeleton from "./DashboardTimeLineSkeleton";
import DashboardSelectDate from "./DashboardSelectDate";
import DashboardDateItems from "./DashboardDateItems";
import DashboardNowMarker from "./DashboardNowMarker";
import DashboardBookingItemComponent from "./DashboardBookingItem";

type AdminScheduleTimelineProps = {
  currentDate: Date;
  selectedDate: Date;
  bookings: DashboardBookingItem[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | undefined;
  onSelectDate: (date: Date) => void;
  onOpenDialog: (booking: DashboardBookingItem) => void;
};

export function AdminScheduleTimeline({
  currentDate,
  selectedDate,
  bookings,
  isLoading,
  isError,
  errorMessage,
  onSelectDate,
  onOpenDialog,
}: AdminScheduleTimelineProps) {
  const t = useTranslations()

  return (
    <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow-md md:rounded-xl md:p-5 lg:rounded-2xl lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{t("user.booking.timeline")}</h2>

          <div className="mt-1 text-sm uppercase text-gray-500">
            <span>{t(`weekdays.${weekdayShort[currentDate.getDay()]}`)}, </span>
            <span>{t(`months.${monthNames[currentDate.getMonth()]}`)} </span>
            <span>{currentDate.getDate()}</span>
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <DashboardSelectDate selectedDate={selectedDate} onSelectDate={onSelectDate} />

          <Link
            href={"/admin/schedule" as Route}
            className="inline-flex items-center justify-center rounded-full bg-[#f49b33] p-2 text-white transition hover:text-[#f49b33]"
          >
            <SquareArrowOutUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <DashboardDateItems selectedDate={selectedDate} onSelectDate={onSelectDate} />

      <div className="pr-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {isError && errorMessage && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("admin.dashboard.error.schedulePrefix", { message: errorMessage })}
          </div>
        )}

        {isLoading && <DashboardTimeLineSkeleton />}

        {!isLoading && bookings.length === 0 && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {t("admin.dashboard.noBookingsForDate")}
          </div>
        )}

        <div className="relative space-y-4">
          {bookings.length > 0 && selectedDate.getTime() === new Date().getTime() && (
            <DashboardNowMarker currentDate={currentDate} />
          )}

          {bookings.map((booking) => (
            <DashboardBookingItemComponent
              key={booking.id}
              booking={booking}
              onOpenDialog={onOpenDialog}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminScheduleTimeline;
