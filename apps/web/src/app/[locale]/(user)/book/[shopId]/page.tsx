"use client";

import { useState, use } from "react";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { cn, formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useLoginDialog } from "@/contexts/LogInDialogContext";
import { DayTimelineResponse, SelectedDateType } from "@/features/booking/types";
import { addMinutes, defaultSelectedDate } from "@/features/booking/utils";
import { useRouter } from "@/i18n/navigation";
import { Route } from "next";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { generateTimeSlots } from "@/features/booking/generate-time-slots";
import { TimeSlotPicker } from "@/features/booking/components/TimeSlotPicker";
import { ShopWithStaffs } from "@/shared/types/shop";
import { dateToUtc, timeZone } from "@noq/shared";

interface Props {
  params: Promise<{ shopId: string }>;
  searchParams: Promise<{ service?: string }>;
}

export default function BookingPage({
  params,
  searchParams,
}: Props) {
  const { shopId } = use(params);
  const { service: serviceFromQuery } = use(searchParams);

  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { open } = useLoginDialog();

  const [selectedDate, setSelectedDate] = useState<SelectedDateType>(defaultSelectedDate);

  const { data: shop, isLoading: isShopLoading } = useApiQuery<ShopWithStaffs>(
    API_ENDPOINTS.shopById(shopId),
    { key: ["shop", shopId] }
  );

  const { data: timelineData, isLoading: isTimelineLoading } = useApiQuery<DayTimelineResponse>(
    `${API_ENDPOINTS.shopTimeline(shopId)}?date=${dateToUtc(selectedDate.date, timeZone)}`,
    { key: ["timeline", shopId, `${selectedDate.date}`] },
  );

  const selectedService = shop?.services.find((service) => service.id === serviceFromQuery);

  const bookingEndTime = selectedDate.time
    ? addMinutes(selectedDate.time, selectedService?.durationMin ?? 0)
    : null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  const timelineSlots = generateTimeSlots({
    shopId,
    date: selectedDate.date,
    durationMin: selectedService?.durationMin ?? 0,
    timeline: timelineData,
  })

  const { mutateAsync: bookingMutation, isPending } = useApiMutation<{ message: string }>(
    API_ENDPOINTS.bookings,
    "post",
  );

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate.time || isAuthLoading) return;

    if (!isAuthenticated) {
      open();
      return;
    }

    const response = await bookingMutation({
      shopId,
      serviceId: selectedService.id,
      staffId: shop?.staffs[0].user?.id || undefined,
      startTime: `${selectedDate.date}T${selectedDate.time}:00`,
    });

    if (response.message === 'success') {
      router.push("/bookings" as Route);
    }
  };

  if (isShopLoading) {
    return (
      <div className="min-h-dvh bg-slate-50 p-4">
        <Skeleton className="h-24 w-full rounded-2xl bg-slate-200" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900 pb-0">
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="text-center">
            <p className="text-sm font-semibold tracking-wide">
              {t("user.booking.title")}
            </p>
            <p className="text-[10px] text-[#F49B33] uppercase tracking-[0.2em]">
              {shop?.name || t("user.booking.defaultShop")}
            </p>
          </div>

          <button className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center">
            <MoreHorizontal className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        {selectedService && (
          <div
            className="rounded-2xl border border-[#f1c894] bg-white p-4 mb-6 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900">
                  {selectedService.name}
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-[#F49B33] dark:text-[#F49B33] font-bold">
                    {formatPrice(selectedService.price ?? 0, locale)} {t("common.currency")}
                  </span>
                  <span className="text-[#d3b089]">·</span>
                  <span className="text-slate-500">
                    {selectedService?.durationMin} {t("user.services.duration")}
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold rounded-full px-4 py-2 border border-[white] bg-[#fff3e6] text-[#F49B33]">
                {t("user.booking.edit")}
              </div>
            </div>
          </div>
        )}

        {shop && shop.staffs.length > 0 && <section className="mb-2">
          <h3 className="text-sm font-semibold mb-3 text-slate-800">
            {t("user.booking.selectStaff")}
          </h3>

          <div className="flex items-start gap-3 overflow-x-auto px-1 snap-x snap-mandatory">
            {shop.staffs.map((member, index) => {

              return (
                <button
                  key={`${member.id ?? "staff"}-${index}`}
                  className="shrink-0 w-23 text-center snap-start flex flex-col items-center"
                >
                  <div className={`h-16 w-16 rounded-full border-2 p-0.5 ${index === 0 ? "border-[#F49B33]" : "border-transparent"}`}>
                    <div className={cn(
                      "h-full w-full rounded-full flex items-center justify-center",
                      index === 0 ? "bg-[#ff951d]" : "bg-[#ff961dc0]"
                    )}>
                      <span className="text-white text-sm font-bold tracking-wide">
                        {getInitials(member.user?.name || '')}
                      </span>
                    </div>
                  </div>

                  <p className={`mt-2 w-full px-1 text-[11px] leading-[1.2] min-h-[2.4rem] whitespace-normal wrap-break-word ${index === 0 ? "text-black" : "text-slate-500"}`}>
                    {member.user?.name}
                  </p>
                </button>
              );
            })}
          </div>
        </section>}

        <section className="mb-6">
          <ScheduleDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </section>

        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[20px] leading-none font-bold text-slate-900">
              {t("user.booking.timeline")}
            </h3>
            <p className="text-[10px] tracking-[0.16em] text-[#F49B33] uppercase">
              {t("user.booking.liveSelection")}
            </p>
          </div>

          <div className="rounded-3xl border border-[#f1c894]/80 bg-white p-3 sm:p-4">
            <TimeSlotPicker
              slots={timelineSlots}
              selectedTime={selectedDate.time}
              durationMin={selectedService?.durationMin ?? 0}
              loading={isTimelineLoading}
              onSelect={(time) => {
                setSelectedDate((prev) => ({
                  ...prev,
                  time,
                }));
              }}
            />
          </div>
        </section>
      </div >

      <div className="mt-6 mb-4 px-3 sm:px-0">
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#f1c894]">
          <div className="rounded-2xl border border-[#f1c894]/70 bg-white p-3 mb-3">
            <div className="flex justify-between text-xs text-slate-600">
              <span className="uppercase tracking-wide">
                {t("user.booking.selectedWindow")}
              </span>
              <span className="uppercase tracking-wide">
                {t("user.booking.total")}
              </span>
            </div>
            <div className="flex justify-between items-end mt-1">
              <p className="font-semibold text-[#F49B33]">
                {selectedDate.time && bookingEndTime
                  ? `${selectedDate.time} — ${bookingEndTime}`
                  : "--:--"}
              </p>

              <p className="text-2xl font-bold text-[#F49B33] dark:text-[#F49B33]">
                {formatPrice(selectedService?.price, locale)} {t("common.currency")}
              </p>
            </div>
          </div>

          <button
            onClick={handleConfirmBooking}
            disabled={!selectedService || !selectedDate.time || isPending || isAuthLoading}
            className="w-full py-3 rounded-full bg-[#F49B33] text-white font-bold tracking-wide disabled:opacity-50"
          >
            {isPending ? t("user.booking.processing") : t("user.booking.confirmBooking")}
          </button>
        </div>
      </div>
    </div >
  );
}
