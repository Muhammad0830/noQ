"use client";

import { useMemo, useState, use } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import type { Shop, Service } from "@shared/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

interface Staff {
  id: string;
  name: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export default function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { id: shopId } = use(params);
  const { service: serviceFromQuery } = use(searchParams);
  const { t, language } = useLanguage();

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    serviceFromQuery ?? null,
  );
  const [showServices, setShowServices] = useState(!serviceFromQuery);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [visibleDayStart, setVisibleDayStart] = useState(0);

  const { data: shop } = useApiQuery<Shop>(API_ENDPOINTS.shopById(shopId), {
    key: ["shop", shopId],
  });
  const { data: services = [], isLoading: servicesLoading } = useApiQuery<
    Service[]
  >(API_ENDPOINTS.shopServices(shopId), {
    key: ["services", shopId],
  });
  const { data: staffData = [] } = useApiQuery<Staff[]>(
    `${API_ENDPOINTS.shopById(shopId)}/staff`,
    {
      key: ["staff", shopId],
    },
  );

  const staff = staffData.length
    ? staffData
    : [
        { id: "mock-1", name: "Marco V." },
        { id: "mock-2", name: "Leo S." },
        { id: "mock-3", name: "Alex K." },
        { id: "mock-4", name: "Sarah J." },
      ];

  const nextDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 14; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  const initialDate = nextDays[0]?.toISOString().split("T")[0] ?? "";
  const effectiveDate = selectedDate || initialDate;

  const { data: slotsData = [] } = useApiQuery<TimeSlot[]>(
    effectiveDate
      ? `${API_ENDPOINTS.bookings}/available-slots?shopId=${shopId}&date=${effectiveDate}`
      : null,
    { key: ["slots", shopId, effectiveDate] },
  );

  const timeSlots = slotsData.length
    ? slotsData
    : [
        { id: "1", time: "09:00", available: false },
        { id: "2", time: "10:00", available: false },
        { id: "3", time: "11:20", available: true },
        { id: "4", time: "13:00", available: false },
        { id: "5", time: "15:00", available: true },
        { id: "6", time: "16:30", available: true },
      ];

  const selectedService = useMemo(() => {
    const found = services.find((service) => service.id === selectedServiceId);
    return found ?? services[0] ?? null;
  }, [services, selectedServiceId]);

  const selectedStaffMember =
    staff.find((member) => member.id === selectedStaff) ?? staff[0] ?? null;
  const selectedDateObj =
    nextDays.find((d) => d.toISOString().split("T")[0] === effectiveDate) ??
    nextDays[0];
  const duration = selectedService?.durationMin ?? 45;
  const bookingEndTime = selectedTime
    ? addMinutes(selectedTime, duration)
    : null;
  const totalPrice = selectedService?.price ?? 0;
  const localeMap = {
    "uz-latn": "uz-UZ",
    "uz-cyrl": "uz-Cyrl-UZ",
    ru: "ru-RU",
  } as const;
  const currentLocale = localeMap[language];

  const weekdayShortMap = {
    "uz-latn": ["Yak", "Dush", "Sesh", "Chor", "Pay", "Juma", "Shan"],
    "uz-cyrl": ["Як", "Душ", "Сеш", "Чор", "Пай", "Жума", "Шан"],
    ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  } as const;

  const monthNameMap = {
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
      "Oktabr",
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
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ],
  } as const;

  const monthYearLabel = selectedDateObj
    ? `${monthNameMap[language][selectedDateObj.getMonth()]} ${selectedDateObj.getFullYear()}`
    : "";

  const dayStartMin = 9 * 60;
  const dayEndMin = 19 * 60;
  const timelineHeight = 520;
  const minuteToTop = (minute: number) =>
    ((minute - dayStartMin) / (dayEndMin - dayStartMin)) * timelineHeight;

  const hourLabels = useMemo(() => {
    const labels: string[] = [];
    for (let h = 9; h <= 19; h += 1) {
      labels.push(`${String(h).padStart(2, "0")}:00`);
    }
    return labels;
  }, []);

  const visibleDays = useMemo(
    () => nextDays.slice(visibleDayStart, visibleDayStart + 5),
    [nextDays, visibleDayStart],
  );

  const timelineSlots = useMemo(
    () =>
      timeSlots
        .map((slot) => ({ ...slot, startMin: timeToMinutes(slot.time) }))
        .filter(
          (slot) => slot.startMin >= dayStartMin && slot.startMin <= dayEndMin,
        )
        .sort((a, b) => a.startMin - b.startMin),
    [timeSlots],
  );

  const bookingMutation = useApiMutation(API_ENDPOINTS.bookings, "post", () => {
    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  });

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedTime) return;

    try {
      await bookingMutation.mutateAsync({
        shopId,
        serviceId: selectedService.id,
        startTime: `${effectiveDate}T${selectedTime}:00`,
      });

      alert(t("booking.success"));
      window.location.href = "/bookings";
    } catch {
      alert(t("booking.error"));
    }
  };

  if (servicesLoading) {
    return (
      <div className="min-h-dvh bg-slate-50 dark:bg-gray-900 p-4">
        <Skeleton className="h-24 w-full rounded-2xl bg-slate-200 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white pb-20">
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-gray-300" />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide">
              {t("booking.title")}
            </p>
            <p className="text-[10px] text-cyan-600 dark:text-teal-400 uppercase tracking-[0.2em]">
              {shop?.name || "Luxe Studio"}
            </p>
          </div>

          <button className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-slate-700 dark:text-gray-300" />
          </button>
        </div>

        {selectedService && (
          <div className="rounded-2xl border border-cyan-200 dark:border-gray-700 bg-linear-to-br from-cyan-50 to-slate-100 dark:from-gray-800 dark:to-gray-800 p-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-linear-to-tr from-amber-300 to-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedService.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs">
                  <span className="text-cyan-600 dark:text-teal-400 font-semibold">
                    ${selectedService.price ?? 0}
                  </span>
                  <span className="text-slate-400 dark:text-gray-500">·</span>
                  <span className="text-slate-500 dark:text-gray-400">
                    {duration} min
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowServices((prev) => !prev)}
                className="text-[11px] font-semibold rounded-full px-3 py-1.5 border border-cyan-400/40 text-cyan-700 dark:text-teal-400"
              >
                {t("booking.edit")}
              </button>
            </div>
          </div>
        )}

        {showServices && (
          <div className="space-y-2 mb-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setShowServices(false);
                }}
                className={`w-full text-left rounded-xl p-3 border ${
                  selectedService?.id === service.id
                    ? "border-cyan-400 bg-cyan-100/70 dark:bg-teal-500/10"
                    : "border-slate-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                }`}
              >
                <p className="text-sm font-medium">{service.name}</p>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  ${service.price ?? 0} · {service.durationMin ?? 45} min
                </p>
              </button>
            ))}
          </div>
        )}

        <section className="mb-6">
          <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-gray-200">
            {t("booking.selectStaff")}
          </h3>
          <div className="flex items-start gap-4 overflow-x-auto pb-2">
            {staff.map((member) => {
              const isActive =
                (selectedStaff ?? selectedStaffMember?.id) === member.id;
              return (
                <button
                  key={member.id}
                  onClick={() => setSelectedStaff(member.id)}
                  className="shrink-0 text-center"
                >
                  <div
                    className={`h-16 w-16 rounded-full border-2 ${isActive ? "border-cyan-400 shadow-[0_0_0_2px_rgba(34,211,238,0.35)]" : "border-slate-300 dark:border-gray-600"} bg-linear-to-b from-orange-300 to-amber-500 p-0.5`}
                  >
                    <div className="h-full w-full rounded-full bg-white dark:bg-gray-800" />
                  </div>
                  <p
                    className={`mt-2 text-[10px] ${isActive ? "text-cyan-600 dark:text-teal-400" : "text-slate-500 dark:text-gray-400"}`}
                  >
                    {member.name}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{monthYearLabel}</h3>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setVisibleDayStart((prev) => Math.max(0, prev - 5))
                }
                className="h-7 w-7 rounded-full border border-slate-300 dark:border-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  setVisibleDayStart((prev) =>
                    Math.min(Math.max(nextDays.length - 5, 0), prev + 5),
                  )
                }
                className="h-7 w-7 rounded-full border border-slate-300 dark:border-gray-700 flex items-center justify-center text-slate-500 dark:text-gray-400"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {visibleDays.map((day) => {
              const dateStr = day.toISOString().split("T")[0];
              const isActive = effectiveDate === dateStr;
              return (
                <button
                  key={dateStr}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedTime(null);
                  }}
                  className={`rounded-xl py-2 text-center border ${
                    isActive
                      ? "bg-cyan-400 text-[#031016] border-cyan-300"
                      : "bg-white border-slate-200 text-slate-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                  }`}
                >
                  <p className="text-[10px] uppercase">
                    {weekdayShortMap[language][day.getDay()]}
                  </p>
                  <p className="text-lg font-semibold leading-5 mt-1">
                    {day.getDate()}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">{t("booking.timeline")}</h3>
            <div className="text-[10px] px-2 py-1 rounded-full bg-cyan-100 dark:bg-teal-500/20 border border-cyan-400/30 text-cyan-700 dark:text-teal-400">
              {t("booking.liveSelection")}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <div className="flex gap-3">
              <div
                className="w-12 shrink-0 relative"
                style={{ height: `${timelineHeight}px` }}
              >
                {hourLabels.map((hour) => {
                  const top = minuteToTop(timeToMinutes(hour));
                  return (
                    <span
                      key={hour}
                      className="absolute -translate-y-2 text-[10px] text-slate-500 dark:text-gray-400"
                      style={{ top }}
                    >
                      {hour}
                    </span>
                  );
                })}
              </div>

              <div
                className="relative flex-1 rounded-xl border border-slate-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-900"
                style={{ height: `${timelineHeight}px` }}
              >
                {hourLabels.map((hour) => {
                  const top = minuteToTop(timeToMinutes(hour));
                  return (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-dashed border-slate-200 dark:border-gray-700"
                      style={{ top }}
                    />
                  );
                })}

                {timelineSlots.map((slot) => {
                  const active = selectedTime === slot.time;
                  const top = minuteToTop(slot.startMin);
                  const height = Math.max(
                    (duration / (dayEndMin - dayStartMin)) * timelineHeight,
                    36,
                  );

                  return (
                    <button
                      key={slot.id}
                      onClick={() =>
                        slot.available && setSelectedTime(slot.time)
                      }
                      disabled={!slot.available}
                      className={`absolute left-2 right-2 rounded-xl border px-3 text-left transition ${
                        !slot.available
                          ? "border-slate-200 dark:border-gray-700 bg-slate-200/50 dark:bg-gray-800 text-slate-400 dark:text-gray-500 cursor-not-allowed"
                          : active
                            ? "border-cyan-400 bg-cyan-100 dark:bg-teal-500/10 text-cyan-700 dark:text-teal-400 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                            : "border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:border-cyan-500/40"
                      }`}
                      style={{ top, height }}
                    >
                      <div className="h-full flex flex-col justify-center">
                        <span className="text-xs font-medium">
                          {slot.time}{" "}
                          {slot.available
                            ? `– ${addMinutes(slot.time, duration)}`
                            : ""}
                        </span>
                        <span className="text-[10px] uppercase opacity-70">
                          {slot.available
                            ? t("booking.availableSlot")
                            : t("booking.alreadyReserved")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 mb-4 px-3 sm:px-0">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/90 dark:bg-gray-900 backdrop-blur-md border border-cyan-200 dark:border-gray-700 shadow-lg">
          <div className="rounded-2xl border border-cyan-300/50 dark:border-gray-700 bg-linear-to-r from-cyan-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 p-3 mb-3">
            <div className="flex justify-between text-xs text-slate-600 dark:text-gray-300">
              <span className="uppercase tracking-wide">
                {t("booking.selectedWindow")}
              </span>
              <span className="uppercase tracking-wide">
                {t("booking.total")}
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <p className="font-semibold text-cyan-700 dark:text-teal-400">
                {selectedTime && bookingEndTime
                  ? `${selectedTime} — ${bookingEndTime}`
                  : "--:--"}
              </p>
              <p className="text-2xl font-bold text-cyan-700 dark:text-teal-400">
                ${totalPrice}
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={
              !selectedService || !selectedTime || bookingMutation.isPending
            }
            className="w-full py-3 rounded-full bg-linear-to-r from-cyan-400 to-emerald-400 text-[#04212b] font-bold tracking-wide disabled:opacity-50"
          >
            {bookingMutation.isPending
              ? t("booking.processing")
              : t("booking.confirmBooking")}
          </button>

          <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-2 flex items-center gap-1">
            <Clock3 className="w-3 h-3" />
            {t("booking.timelineHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
