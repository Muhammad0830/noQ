"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import {
  ChevronDown,
  CircleCheckBig,
  CircleX,
  SquareArrowOutUpRight,
  X,
} from "lucide-react";

export type AdminDashboardBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type AdminDashboardBooking = {
  id: string;
  status: AdminDashboardBookingStatus;
  startTime: string;
  endTime: string;
  user?: { name?: string | null } | null;
  service?: { name?: string | null; durationMin?: number | null } | null;
  staff?: { user?: { name?: string | null } | null } | null;
};

export type TimelineAppointment = {
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
  status: AdminDashboardBookingStatus;
};

type AdminScheduleTimelineProps = {
  locale?: string;
  language: string;
  currentDate: Date;
  selectedDate: Date;
  selectedMonthDate: Date;
  now: Date;
  appointments: TimelineAppointment[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  currentTimeLabel: string;
  getAdminHrefWithShopId: (path: string) => string;
  isUpdatingBookingStatus: boolean;
  isCompletingBooking: boolean;
  isCancellingBooking: boolean;
  selectedPendingAppointment: TimelineAppointment | null;
  onSelectDate: (date: Date) => void;
  onSelectMonth: (date: Date) => void;
  onOpenPendingAppointment: (appointment: TimelineAppointment) => void;
  onClosePendingAppointment: () => void;
  onUpdatePendingAppointmentStatus: (
    nextStatus: "COMPLETED" | "CANCELLED",
  ) => Promise<void> | void;
  t: (key: string, options?: Record<string, string | number>) => string;
};

const asRoute = (href: string) => href as Route;

const monthNames: Record<string, string[]> = {
  "uz-latn": [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr",
  ],
  "uz-cyrl": [
    "Январ",
    "Феврал",
    "Март",
    "Апрел",
    "Май",
    "Июн",
    "Июл",
    "Август",
    "Сентябр",
    "Октябр",
    "Ноябр",
    "Декабр",
  ],
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
};

const weekdayShort: Record<string, string[]> = {
  "uz-latn": ["YAK", "DUSH", "SESH", "CHOR", "PAY", "JUM", "SHA"],
  "uz-cyrl": ["ЯКШ", "ДУШ", "СЕШ", "ЧОР", "ПАЙ", "ЖУМ", "ШАН"],
  ru: ["ВС", "ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ"],
};

const statusLabels: Record<AdminDashboardBookingStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
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
} as const;

const getWeekDates = (selectedMonthDate: Date, currentDate: Date) => {
  const result: Date[] = [];
  const selectedYear = selectedMonthDate.getFullYear();
  const selectedMonth = selectedMonthDate.getMonth();
  const isCurrentMonth =
    selectedYear === currentDate.getFullYear() &&
    selectedMonth === currentDate.getMonth();

  const start = isCurrentMonth
    ? new Date(currentDate)
    : new Date(selectedYear, selectedMonth, 1);
  start.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
  const cursor = new Date(start);
  while (cursor <= endOfMonth) {
    result.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  return result;
};

export function AdminScheduleTimeline({
  locale,
  language,
  currentDate,
  selectedDate,
  selectedMonthDate,
  now,
  appointments,
  isLoading,
  isError,
  errorMessage,
  currentTimeLabel,
  getAdminHrefWithShopId,
  isUpdatingBookingStatus,
  isCompletingBooking,
  isCancellingBooking,
  selectedPendingAppointment,
  onSelectDate,
  onSelectMonth,
  onOpenPendingAppointment,
  onClosePendingAppointment,
  onUpdatePendingAppointmentStatus,
  t,
}: AdminScheduleTimelineProps) {
  const [monthOpen, setMonthOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement | null>(null);

  const monthOptions = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const options: Date[] = [];

    for (let month = currentMonth; month < 12; month += 1) {
      options.push(new Date(currentYear, month, 1));
    }

    return options;
  }, [currentDate]);

  const weekDates = useMemo(
    () => getWeekDates(selectedMonthDate, currentDate),
    [currentDate, selectedMonthDate],
  );

  const selectedMonthLabel = (monthNames[language] || monthNames["uz-latn"])[
    selectedMonthDate.getMonth()
  ];

  const headerWeekday = (
    weekdayShort[language]?.[currentDate.getDay()] ??
    currentDate.toLocaleDateString(locale || undefined, { weekday: "long" })
  ).toUpperCase();

  const headerMonthDay =
    `${monthNames[language]?.[currentDate.getMonth()] ?? currentDate.toLocaleDateString(locale || undefined, { month: "long" })} ${currentDate.getDate()}`.toUpperCase();

  const isSelectedToday = useMemo(
    () => selectedDate.toDateString() === new Date().toDateString(),
    [selectedDate],
  );

  useEffect(() => {
    if (!monthOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!monthDropdownRef.current) return;
      if (!monthDropdownRef.current.contains(event.target as Node)) {
        setMonthOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMonthOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [monthOpen]);

  const nowMarkerTop = useMemo<number | null>(() => {
    if (!isSelectedToday) {
      return null;
    }

    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();
    const fractionOfDay = minutesSinceMidnight / (24 * 60);
    return Math.min(Math.max(fractionOfDay * 100, 6), 94);
  }, [isSelectedToday, now]);

  return (
    <div className="lg:col-span-2 rounded-xl bg-white p-4 shadow-md md:rounded-xl md:p-5 lg:rounded-2xl lg:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{t("booking.timeline")}</h2>
          <div className="mt-1 text-sm uppercase text-gray-500">
            {headerWeekday}, {headerMonthDay}
          </div>
        </div>

        <div className="relative flex items-center gap-3">
          <div ref={monthDropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setMonthOpen((value) => !value)}
              className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
            >
              <span className="text-sm text-orange-400">
                {selectedMonthLabel}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>

            {monthOpen && (
              <div className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border bg-white shadow-lg">
                <div className="max-h-44 overflow-y-auto">
                  {monthOptions.map((optionDate) => {
                    const monthIdx = optionDate.getMonth();
                    const optionYear = optionDate.getFullYear();
                    const monthText = (monthNames[language] ||
                      monthNames["uz-latn"])[monthIdx];
                    const isSelected =
                      monthIdx === selectedMonthDate.getMonth() &&
                      optionYear === selectedMonthDate.getFullYear();

                    return (
                      <button
                        type="button"
                        key={`${optionYear}-${monthIdx}`}
                        onClick={() => {
                          onSelectMonth(new Date(optionYear, monthIdx, 1));
                          const today = new Date();
                          if (
                            optionYear === today.getFullYear() &&
                            monthIdx === today.getMonth()
                          ) {
                            onSelectDate(
                              new Date(
                                today.getFullYear(),
                                today.getMonth(),
                                today.getDate(),
                              ),
                            );
                          } else {
                            onSelectDate(new Date(optionYear, monthIdx, 1));
                          }
                          setMonthOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${isSelected ? "bg-orange-50" : ""}`}
                      >
                        <div
                          className={`text-sm font-bold ${isSelected ? "text-orange-500" : "text-gray-700"}`}
                        >
                          {monthText}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href={asRoute(getAdminHrefWithShopId("/admin/schedule"))}
            className="inline-flex items-center justify-center rounded-full bg-orange-400 p-2 text-white transition hover:bg-orange-500"
            aria-label={t("admin.dashboard.openSchedule")}
          >
            <SquareArrowOutUpRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto overflow-y-hidden p-1 md:gap-2.5 lg:gap-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {weekDates.map((day) => {
          const isToday = day.toDateString() === currentDate.toDateString();
          const isSelected = day.toDateString() === selectedDate.toDateString();
          const shortDay = (
            weekdayShort[language]?.[day.getDay()] ??
            day.toLocaleDateString(locale || undefined, { weekday: "short" })
          ).toUpperCase();

          return (
            <button
              key={day.toDateString()}
              type="button"
              onClick={() => {
                const nextDate = new Date(day);
                nextDate.setHours(0, 0, 0, 0);
                onSelectDate(nextDate);
                onSelectMonth(
                  new Date(nextDate.getFullYear(), nextDate.getMonth(), 1),
                );
              }}
              aria-pressed={isSelected}
              className={`flex min-w-14 flex-col items-center justify-center rounded-2xl border transition-all duration-200 md:min-w-14 lg:min-w-16 ${isSelected ? "scale-105 border-orange-300 bg-orange-400 text-white shadow-lg ring-2 ring-orange-200" : "border-transparent bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-500"} ${isSelected ? "px-5 py-4 md:px-5 md:py-4 lg:px-6 lg:py-5" : "px-3 py-2.5 md:px-3.5 md:py-2.5 lg:px-4 lg:py-3"}`}
            >
              <div className="text-[10px] opacity-80 md:text-[11px] lg:text-xs">
                {shortDay}
              </div>
              <div
                className={`font-semibold ${isSelected ? "text-lg md:text-lg lg:text-xl" : "text-base"}`}
              >
                {day.getDate()}
              </div>
              {isToday && (
                <div
                  className={`mt-1 h-1 w-1 rounded-full md:mt-1.5 lg:mt-2 ${isSelected ? "bg-white" : "bg-orange-400"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {isError && (
          <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t("admin.dashboard.error.schedulePrefix", {
              message: errorMessage,
            })}
          </div>
        )}

        {isLoading && (
          <div className="mb-4 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`timeline-skeleton-${index}`}
                className="grid grid-cols-[40px_12px_minmax(0,1fr)] items-start gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2"
              >
                <div className="flex justify-start pt-1 md:pt-1 lg:pt-2">
                  <div className="h-2.5 w-7 rounded-full bg-gray-200 md:h-3 md:w-7 lg:h-3 lg:w-8" />
                </div>
                <div className="relative min-h-full min-w-0">
                  <span className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gray-200" />
                  <span className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-gray-200" />
                </div>
                <div className="min-w-0">
                  <div className="rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm md:px-4 md:py-3.5 lg:rounded-3xl lg:px-5 lg:py-4">
                    <div className="mb-1 flex min-w-0 items-start justify-between gap-2 sm:gap-3">
                      <div className="h-5 w-28 rounded-full bg-gray-200" />
                      <div className="h-5 w-20 shrink-0 rounded-full bg-gray-200" />
                    </div>
                    <div className="mt-1 flex min-w-0 items-center gap-2">
                      <div className="h-3 w-36 rounded-full bg-gray-200" />
                      <div className="h-5 w-14 shrink-0 rounded-full bg-gray-200" />
                    </div>
                    <div className="my-3 h-px bg-gray-200" />
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-gray-200" />
                      <div className="h-3 w-40 rounded-full bg-gray-200" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && appointments.length === 0 && (
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            {t("admin.dashboard.noBookingsForDate")}
          </div>
        )}

        <div className="relative space-y-4">
          {isSelectedToday && nowMarkerTop !== null && (
            <div
              className="pointer-events-none absolute left-0 right-0 z-20"
              style={{ top: nowMarkerTop }}
            >
              <div className="grid grid-cols-[40px_12px_minmax(0,1fr)] items-center gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2">
                <div className="flex justify-end">
                  <span className="z-30 inline-flex rounded-full bg-orange-400 px-2 py-0.5 text-[8px] font-bold text-white shadow-sm md:px-2 md:py-0.5 lg:px-2.5 lg:py-0.5 lg:text-[9px]">
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

          {appointments.map((appointment) => {
            const statusStyle = statusStyles[appointment.status];
            const isCompleted = appointment.status === "COMPLETED";
            const isPending = appointment.status === "PENDING";
            const displayStatus =
              statusLabels[appointment.status] || appointment.status;

            return (
              <Fragment key={appointment.id}>
                <div className="relative z-10 grid grid-cols-[40px_12px_minmax(0,1fr)] items-start gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2">
                  <div
                    className={`pt-1 text-[9px] font-semibold md:pt-1.5 md:text-[10px] lg:pt-2 lg:text-[11px] ${statusStyle.time}`}
                  >
                    {appointment.time}
                  </div>

                  <div className="relative min-h-full min-w-0">
                    <span className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gray-300" />
                    <span
                      className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 bg-white ${statusStyle.dot}`}
                    />
                  </div>

                  <div className="min-w-0 pl-0.5 md:pl-1 lg:pl-1.5">
                    <div
                      onClick={() => onOpenPendingAppointment(appointment)}
                      className={`rounded-2xl px-3 py-3 shadow-sm md:rounded-2xl md:px-4 md:py-3.5 lg:rounded-3xl lg:px-5 lg:py-4 ${statusStyle.card} ${
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
                      <div className="mb-0.5 flex min-w-0 items-start justify-between gap-1.5 md:mb-1 md:gap-2 lg:mb-1 lg:gap-3">
                        <p className="min-w-0 flex-1 text-sm font-bold leading-tight text-gray-900 md:text-base lg:text-lg">
                          {appointment.customer}
                        </p>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[7px] font-bold tracking-widest whitespace-nowrap md:px-2 md:py-0.5 md:text-[8px] lg:px-2.5 lg:py-1 lg:text-[9px] ${statusStyle.badge}`}
                        >
                          {displayStatus}
                        </span>
                      </div>

                      <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400 md:mt-1 md:gap-1.5 md:text-xs lg:mt-1 lg:gap-2 lg:text-xs">
                        <span className="min-w-0 flex-1 truncate">
                          {appointment.service}
                        </span>
                        <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-orange-500 whitespace-nowrap md:px-2.5 md:text-[9px] lg:px-2.5 lg:py-1 lg:text-[10px]">
                          {appointment.timeMinutes}
                        </span>
                      </div>

                      <div className="my-2 h-px bg-gray-300 md:my-2.5 lg:my-3" />

                      <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400 md:gap-1.5 md:text-xs lg:gap-2 lg:text-xs">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-100 text-[8px] font-semibold text-orange-600 md:h-5 md:w-5 lg:h-6 lg:w-6 lg:text-[10px]">
                          {appointment.stylist
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </span>
                        <span className="truncate">
                          {t("booking.staff")}:{" "}
                          <span className="font-semibold text-gray-700">
                            {appointment.stylist}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>

      {selectedPendingAppointment && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={onClosePendingAppointment}
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
                onClick={onClosePendingAppointment}
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
                {selectedPendingAppointment.customer} -{" "}
                {selectedPendingAppointment.service}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onUpdatePendingAppointmentStatus("CANCELLED")}
                disabled={isUpdatingBookingStatus}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 disabled:opacity-60"
              >
                <CircleX className="h-3.5 w-3.5" />
                {isCancellingBooking
                  ? t("common.loading")
                  : t("admin.bookingModal.cancelAction")}
              </button>
              <button
                type="button"
                onClick={() => onUpdatePendingAppointmentStatus("COMPLETED")}
                disabled={isUpdatingBookingStatus}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-500 px-3 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.3)] transition hover:bg-green-600 disabled:opacity-60"
              >
                <CircleCheckBig className="h-3.5 w-3.5" />
                {isCompletingBooking
                  ? t("common.loading")
                  : t("admin.bookingModal.completeAction")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminScheduleTimeline;
