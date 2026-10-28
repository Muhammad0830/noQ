"use client";

import { useState, use } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginDialog } from "@/contexts/LogInDialogContext";
import { DayTimelineResponse, SelectedDateType } from "@/features/booking/types";
import { addMinutes, defaultSelectedDate } from "@/features/booking/utils";
import { useRouter } from "@/i18n/navigation";
import { Route } from "next";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { generateTimeSlots } from "@/features/booking/generate-time-slots";
import { TimeSlotPicker } from "@/features/booking/components/TimeSlotPicker";
import Header from "@/features/booking/components/Header";
import SelectedServiceCard from "@/features/booking/components/SelectedServiceCard";
import SelectStaffSection from "@/features/booking/components/SelectStaffSection";
import BookingFooter from "@/features/booking/components/BookingFooter";
import { ShopDetails } from "@noq/shared";

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
  const router = useRouter();

  const { open } = useLoginDialog();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [selectedDate, setSelectedDate] = useState<SelectedDateType>(defaultSelectedDate);

  const { data: shop, isLoading: isShopLoading } = useApiQuery<ShopDetails>(
    API_ENDPOINTS.shopById(shopId),
    { key: ["shop", shopId] }
  );

  const { data: timelineData, isLoading: isTimelineLoading } = useApiQuery<DayTimelineResponse>(
    `${API_ENDPOINTS.shopTimeline(shopId)}?date=${selectedDate.date}`,
    { key: ["timeline", shopId, `${selectedDate.date}`], enabled: !!shop },
  );

  const { mutateAsync: bookingMutation, isPending } = useApiMutation<{ message: string }>(
    API_ENDPOINTS.bookings,
    "post",
  );

  const selectedService = shop?.services.find((service) => service.id === serviceFromQuery);

  const bookingEndTime = selectedDate.time
    ? addMinutes(selectedDate.time, selectedService?.durationMin ?? 0)
    : null;

  const timelineSlots = shop ? generateTimeSlots({
    shopId,
    date: selectedDate.date,
    durationMin: selectedService?.durationMin ?? 0,
    timeline: timelineData,
    timezone: shop?.timezone
  }) : [];

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate.time || isAuthLoading) return;

    if (!isAuthenticated) {
      open();
      return;
    }

    const response = await bookingMutation({
      shopId,
      serviceId: selectedService.id,
      staffId: shop?.staffs[0]?.id || undefined,
      date: selectedDate.date,
      startTime: selectedDate.time,
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
    <div className="min-h-dvh max-w-md mx-auto px-4 bg-white text-slate-900 pb-0">
      <div className="pt-3">
        <Header shopName={shop?.name} />

        {selectedService && <SelectedServiceCard service={selectedService} />}

        <SelectStaffSection shop={shop} />

        <ScheduleDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

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
      </div >

      <BookingFooter
        selectedDate={selectedDate}
        bookingEndTime={bookingEndTime}
        selectedService={selectedService}
        disabled={!selectedService || !selectedDate.time || isPending || isAuthLoading}
        isPending={isPending}
        onConfirm={handleConfirmBooking}
      />
    </div >
  );
}
