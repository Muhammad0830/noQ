"use client";

import { useEffect, useMemo, useState, use } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import type { Shop, Service } from "@shared/types/general_types";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface Staff {
  id: string;
  name: string;
  avatarUrl?: string | null;
}

interface ShopStaffApiItem {
  id: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  user?: {
    name?: string | null;
    email?: string | null;
    avatarUrl?: string | null;
  } | null;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface ScheduleSlot extends TimeSlot {
  startMin: number;
}

interface TimelineRange {
  start: string;
  end: string;
}

interface DayTimelineResponse {
  open: string | null;
  close: string | null;
  disabled: TimelineRange[];
  busy: TimelineRange[];
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

const toRangeMinutes = (value: string) => {
  // If backend returns an ISO datetime (with 'T'), extract the time part
  // without letting the Date constructor apply timezone conversions.
  if (value.includes("T")) {
    const timePart = value.split("T")[1].split(/[Z+-]/)[0];
    const [h, m] = timePart.split(":").map((s) => Number(s));
    return h * 60 + (isNaN(m) ? 0 : m);
  }

  // Plain HH:MM string
  return timeToMinutes(value);
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
  const { t, locale } = useLanguage();

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
  const staff = useMemo<Staff[]>(() => {
    const members = (shop as any)?.staffs ?? [];
    return members.map((member: any) => ({
      id: member.id,
      name: member.user?.name?.trim() || member.user?.email?.trim() || "Staff",
      avatarUrl: member.user?.avatarUrl || null,
    }));
  }, [shop]);

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
  const selectedService = useMemo(() => {
    const found = services.find((service) => service.id === selectedServiceId);
    return found ?? services[0] ?? null;
  }, [services, selectedServiceId]);
  const activeStaffId =
    selectedStaff ||
    (selectedService && !selectedService.assignedToAllStaff
      ? selectedService.assignedStaffId || undefined
      : undefined);

  const { data: timelineData, isLoading: timelineLoading } =
    useApiQuery<DayTimelineResponse>(
      effectiveDate
        ? `${API_ENDPOINTS.shopTimeline(shopId)}?date=${effectiveDate}`
        : null,
      { key: ["timeline", shopId, effectiveDate, selectedService?.id] },
    );

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
  const monthYearFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }),
    [locale],
  );

  const weekdayShortFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { weekday: "short" }),
    [locale],
  );

  const monthYearLabel = selectedDateObj
    ? monthYearFormatter.format(selectedDateObj)
    : "";

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const avatarGradients = [
    "from-[#F49B33] to-[#ffd39a]",
    "from-[#f28c1b] to-[#f49b33]",
    "from-[#f4b35c] to-[#f49b33]",
  ] as const;

  const breakStartMin = 12 * 60;
  const breakEndMin = 13 * 60;

  const visibleDays = useMemo(
    () => nextDays.slice(visibleDayStart, visibleDayStart + 5),
    [nextDays, visibleDayStart],
  );

  const timelineSlots = useMemo(() => {
    if (!timelineData?.open || !timelineData.close || !selectedService) {
      return [];
    }

    const durationMin = selectedService.durationMin ?? 45;
    const busyRanges = [
      ...(timelineData.busy ?? []),
      ...(timelineData.disabled ?? []),
    ];
    const openMin = timeToMinutes(timelineData.open);
    const closeMin = timeToMinutes(timelineData.close);
    const slots: ScheduleSlot[] = [];

    for (
      let cursor = openMin;
      cursor + durationMin <= closeMin;
      cursor += durationMin
    ) {
      const start = `${String(Math.floor(cursor / 60)).padStart(2, "0")}:${String(cursor % 60).padStart(2, "0")}`;
      const end = addMinutes(start, durationMin);
      const slotStartMin = cursor;
      const slotEndMin = cursor + durationMin;

      const hasConflict = busyRanges.some((range) => {
        const rangeStartMin = toRangeMinutes(range.start);
        const rangeEndMin = toRangeMinutes(range.end);
        return rangeStartMin < slotEndMin && rangeEndMin > slotStartMin;
      });

      slots.push({
        id: `${shopId}-${effectiveDate}-${start}`,
        time: start,
        available: !hasConflict,
        startMin: cursor,
      });
    }

    return slots;
  }, [effectiveDate, shopId, selectedService, timelineData]);

  const { mutateAsync: bookingMutation, isPending } = useApiMutation(
    API_ENDPOINTS.bookings,
    "post",
  );

  useEffect(() => {
    if (!selectedService) return;

    if (
      !selectedService.assignedToAllStaff &&
      selectedService.assignedStaffId
    ) {
      setSelectedStaff(selectedService.assignedStaffId);
      return;
    }

    if (!selectedStaff && staff.length > 0) {
      setSelectedStaff(staff[0]!.id);
    }
  }, [selectedService, selectedStaff, staff]);

  const toggleServices = () => {
    setShowServices((prev) => !prev);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedTime) return;

    try {
      await bookingMutation({
        shopId,
        serviceId: selectedService.id,
        staffId: activeStaffId || undefined,
        startTime: `${effectiveDate}T${selectedTime}:00`,
      });

      window.location.href = "/user/bookings";
    } catch (err) {
      console.error("booking error", err);
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
    <div className="min-h-dvh bg-white dark:bg-[#211201] text-slate-900 dark:text-white pb-0">
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
            <p className="text-[10px] text-[#F49B33] dark:text-[#F49B33] uppercase tracking-[0.2em]">
              {shop?.name || t("booking.defaultShop")}
            </p>
          </div>

          <button className="h-9 w-9 rounded-full bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-slate-700 dark:text-gray-300" />
          </button>
        </div>

        {selectedService && (
          <div
            onClick={toggleServices}
            className="rounded-2xl border border-[#f1c894] bg-white p-4 mb-6 cursor-pointer dark:border-[#F49B33]/25"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  {selectedService.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-[#F49B33] dark:text-[#F49B33] font-bold">
                    ${selectedService.price ?? 0}
                  </span>
                  <span className="text-[#d3b089] dark:text-[#b89163]">·</span>
                  <span className="text-slate-500 dark:text-slate-300">
                    {duration} {t("services.duration")}
                  </span>
                </div>
              </div>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  toggleServices();
                }}
                className="text-xs font-semibold rounded-full px-4 py-2 border border-[white] bg-[#fff3e6] text-[#F49B33] dark:border-[#F49B33]/40 dark:bg-[#F49B33]/10 dark:text-[#F49B33]"
              >
                {t("booking.edit")}
              </button>
            </div>
          </div>
        )}

        {showServices && (
          <div className="space-y-2 mb-6">
            {services.map((service, index) => (
              <button
                key={`${service.id ?? "service"}-${index}`}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setShowServices(false);
                }}
                className={`w-full text-left rounded-xl p-3 border ${
                  selectedService?.id === service.id
                    ? "border-[#F49B33] bg-white dark:border-[#F49B33]/55 dark:bg-[#F49B33]/10"
                    : "border-slate-200 bg-white dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {service.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                  {service.price ?? 0} {t("services.price")} ·{" "}
                  {service.durationMin ?? 45} {t("services.duration")}
                </p>
              </button>
            ))}
          </div>
        )}

        <section className="mb-2">
          <h3 className="text-sm font-semibold mb-3 text-slate-800 dark:text-gray-200">
            {t("booking.selectStaff")}
          </h3>
          <div className="flex items-start gap-3 overflow-x-auto px-1 snap-x snap-mandatory">
            {staff.map((member, index) => {
              const isActive =
                (selectedStaff ?? selectedStaffMember?.id) === member.id;
              const gradientClass =
                avatarGradients[index % avatarGradients.length];
              return (
                <button
                  key={`${member.id ?? "staff"}-${index}`}
                  onClick={() => setSelectedStaff(member.id)}
                  className="shrink-0 w-23 text-center snap-start flex flex-col items-center"
                >
                  <div
                    className={`h-16 w-16 rounded-full border-2 p-0.5 ${isActive ? "border-[#F49B33]" : "border-slate-300 dark:border-white/20"}`}
                  >
                    <div
                      className={`h-full w-full rounded-full bg-linear-to-br ${gradientClass} flex items-center justify-center`}
                    >
                      <span className="text-white text-sm font-bold tracking-wide">
                        {getInitials(member.name)}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`mt-2 w-full px-1 text-[11px] leading-[1.2] min-h-[2.4rem] whitespace-normal wrap-break-word ${isActive ? "text-[black] dark:text-[white]" : "text-slate-500 dark:text-slate-300"}`}
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
            {visibleDays.map((day, index) => {
              const dateStr = day.toISOString().split("T")[0];
              const isActive = effectiveDate === dateStr;
              return (
                <button
                  key={`${dateStr}-${index}`}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedTime(null);
                  }}
                  className={`rounded-xl py-2 text-center border ${
                    isActive
                      ? "bg-[#F49B33] text-white border-[#F49B33]"
                      : "bg-white border-[#ead8c3] text-slate-700 dark:bg-white/5 dark:border-white/10 dark:text-slate-300"
                  }`}
                >
                  <p className="text-[10px] uppercase">
                    {weekdayShortFormatter.format(day)}
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
            <h3 className="text-[20px] leading-none font-bold text-slate-900 dark:text-white">
              {t("booking.timeline")}
            </h3>
            <p className="text-[10px] tracking-[0.16em] text-[#F49B33] dark:text-[#F49B33] uppercase">
              {t("booking.liveSelection")}
            </p>
          </div>

          <div className="rounded-3xl border border-[#f1c894]/80 bg-white p-3 sm:p-4 dark:border-[#F49B33]/20">
            <div className="max-h-72 overflow-y-auto pr-1">
              {timelineLoading ? (
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={`timeline-skeleton-${idx}`}
                      className="rounded-3xl min-h-18 border border-[#f1c894]/80 dark:border-[#F49B33]/30 p-3"
                    >
                      <Skeleton className="h-4 w-28 mx-auto rounded bg-[#fde5c7] dark:bg-[#F49B33]/20" />
                      <Skeleton className="h-2 w-16 mx-auto mt-2 rounded bg-[#fde5c7] dark:bg-[#F49B33]/15" />
                    </div>
                  ))}
                </div>
              ) : timelineSlots.length === 0 ? (
                <div className="rounded-2xl border border-[#f1c894]/80 bg-white/80 px-3 py-4 text-center text-sm text-slate-600 dark:border-[#F49B33]/30 dark:bg-[#F49B33]/8 dark:text-slate-300">
                  {t("booking.noSlots")}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {timelineSlots.map((slot, index) => {
                    const isSelected = selectedTime === slot.time;
                    const isBreakTime =
                      slot.startMin >= breakStartMin &&
                      slot.startMin < breakEndMin;
                    const isBooked = !slot.available;
                    const canSelect = !isBreakTime && !isBooked;
                    const endTime = addMinutes(slot.time, duration);
                    const status = isSelected
                      ? "selected"
                      : isBreakTime
                        ? "break"
                        : isBooked
                          ? "booked"
                          : "available";
                    const statusLabel =
                      status === "selected"
                        ? t("booking.selected")
                        : status === "available"
                          ? t("booking.availableSlot")
                          : status === "break"
                            ? t("booking.break")
                            : t("booking.alreadyReserved");
                    const timeColorClass =
                      status === "selected"
                        ? "text-white dark:text-white"
                        : status === "available"
                          ? "text-[#F49B33] dark:text-[#F49B33]"
                          : status === "break"
                            ? "text-[#8a5620] dark:text-[#ffd4a6]"
                            : "text-slate-600 dark:text-slate-400";
                    const statusColorClass =
                      status === "selected"
                        ? "text-white"
                        : status === "available"
                          ? "text-[#F49B33] dark:text-[#F49B33]"
                          : status === "break"
                            ? "text-[#8a5620] dark:text-[#ffd4a6]"
                            : "text-slate-500 dark:text-slate-400";

                    return (
                      <button
                        key={`${slot.id ?? "slot"}-${index}`}
                        onClick={() => canSelect && setSelectedTime(slot.time)}
                        disabled={!canSelect}
                        className={`rounded-3xl min-h-18 border px-3 py-2 text-center transition-all ${
                          status === "selected"
                            ? "border-[#F49B33] bg-[#F49B33] text-white dark:border-[#F49B33] dark:bg-[#F49B33] dark:text-white"
                            : status === "available"
                              ? "border-[#f1c894] bg-white/95 text-[#F49B33] hover:border-[#F49B33] hover:bg-[#fff3e6] dark:border-[#F49B33]/35 dark:bg-[#F49B33]/8 dark:text-[#F49B33] dark:hover:border-[#F49B33] dark:hover:bg-[#F49B33]/12"
                              : status === "break"
                                ? "border-[#f1c894] bg-[#fff3e6] text-[#8a5620] cursor-not-allowed dark:border-[#F49B33]/30 dark:bg-[#2b170b] dark:text-[#ffd4a6]"
                                : "border-slate-200 bg-slate-100/90 text-slate-500 cursor-not-allowed dark:border-white/10 dark:bg-[#090d1b] dark:text-slate-500"
                        }`}
                      >
                        <p
                          className={`text-[14px] leading-none font-bold tracking-tight ${timeColorClass}`}
                        >
                          {slot.time} - {endTime}
                        </p>
                        <p
                          className={`mt-1 text-[8px] uppercase tracking-[0.08em] font-semibold opacity-95 ${statusColorClass}`}
                        >
                          {statusLabel}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 mb-4 px-3 sm:px-0">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/90 dark:bg-[#211201] backdrop-blur-md border border-[#f1c894] dark:border-[#F49B33]/20">
          <div className="rounded-2xl border border-[#f1c894]/70 dark:border-[#F49B33]/25 bg-white p-3 mb-3 dark:from-[#2b170b] dark:to-[#211201]">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="uppercase tracking-wide">
                {t("booking.selectedWindow")}
              </span>
              <span className="uppercase tracking-wide">
                {t("booking.total")}
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <p className="font-semibold text-[#F49B33] dark:text-[#F49B33]">
                {selectedTime && bookingEndTime
                  ? `${selectedTime} — ${bookingEndTime}`
                  : "--:--"}
              </p>
              <p className="text-2xl font-bold text-[#F49B33] dark:text-[#F49B33]">
                ${totalPrice}
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={!selectedService || !selectedTime || isPending}
            className="w-full py-3 rounded-full bg-[#F49B33] text-white font-bold tracking-wide disabled:opacity-50"
          >
            {isPending ? t("booking.processing") : t("booking.confirmBooking")}
          </button>
        </div>
      </div>
    </div>
  );
}
