"use client";

import { useState, use } from "react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginDialog } from "@/contexts/LogInDialogContext";
import { SelectedDateType } from "@/features/booking/types";
import { addMinutes, defaultSelectedDate } from "@/features/booking/utils";
import { useRouter } from "@/i18n/navigation";
import { Route } from "next";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { TimeSlotPicker } from "@/features/booking/components/TimeSlotPicker";
import Header from "@/features/booking/components/Header";
import SelectedServiceCard from "@/features/booking/components/SelectedServiceCard";
import SelectStaffSection from "@/features/booking/components/SelectStaffSection";
import BookingFooter from "@/features/booking/components/BookingFooter";
import { ShopDetails, BookingSlot } from "@noq/shared";

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

  const { data: slotsData = [], isLoading: isTimelineLoading } = useApiQuery<BookingSlot[]>(
    `${API_ENDPOINTS.bookingsAvailableSlots}?date=${selectedDate.date}&serviceId=${serviceFromQuery}&shopId=${shopId}`,
    { key: ["timeline", shopId, selectedDate.date, `${serviceFromQuery}`], enabled: !!shop },
  );

  const { mutateAsync: bookingMutation, isPending } = useApiMutation<{ message: string }>(
    API_ENDPOINTS.bookings,
    "post",
  );

  const selectedService = shop?.services.find((service) => service.id === serviceFromQuery);

  const bookingEndTime = selectedDate.time
    ? addMinutes(selectedDate.time, selectedService?.durationMin ?? 0)
    : null;

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate.time || isAuthLoading) return;

    if (!isAuthenticated) {
      open();
      return;
    }

    await bookingMutation({
      shopId,
      serviceId: selectedService.id,
      staffId: shop?.staffs[0]?.id || undefined,
      date: selectedDate.date,
      startTime: selectedDate.time,
    }, {
      onSuccess: () => {
        router.push("/bookings" as Route);
      }
    });
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
          slots={slotsData}
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
