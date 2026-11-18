"use client";

import { useMemo, useState } from "react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Clock,
  UserRound,
} from "lucide-react";
import useApiQuery from "@/hooks/useApiQuery";
import { useApiMutation } from "@/hooks/useApiMutation";
import { API_ENDPOINTS } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { BookingSlot, formatToDateString, Service, Staff, startOfDay, UserIdentity } from "@noq/shared";
import { useShop } from "@/contexts/ShopContext";
import SearchUserDialog from "@/components/admin/bookingCreate/SearchUserDIalog";
import { parse } from "date-fns";
import SelectService from "@/components/admin/bookingCreate/SelectService";
import SelectStaff from "@/components/admin/bookingCreate/SelectStaff";
import ScheduleDatePicker from "@/features/booking/components/ScheduleDatePicker";
import { TimeSlotPicker } from "@/features/booking/components/TimeSlotPicker";
import SummarySection from "@/components/admin/bookingCreate/SummarySection";

type SlotItem = {
  id: string;
  time: string;
  available: boolean;
  durationMin: number;
  bufferTime: number;
};

const timeToMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

interface DateType {
  date: string;
  time: string | null;
}

const defaultSelectedDate = (date: Date): DateType => {
  return {
    date: formatToDateString(date),
    time: null,
  }
}

export default function AdminNewBookingPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale()
  const { shop } = useShop();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateType>(defaultSelectedDate(new Date()));
  const [selectedCustomer, setSelectedCustomer] = useState<UserIdentity | null>(null)

  const slotsUrl = useMemo(() => {
    if (!shop?.id || !selectedDate || !selectedService) return null;

    const params = new URLSearchParams({
      shopId: shop?.id,
      date: selectedDate.date,
      serviceId: selectedService.id,
    });

    if (selectedStaff) {
      params.set("staffId", selectedStaff.id);
    }

    return `${API_ENDPOINTS.bookingsAvailableSlots}?${params.toString()}`;
  }, [shop?.id, selectedDate, selectedService, selectedStaff]);

  const { data: slots = [], isLoading: slotsLoading } = useApiQuery<BookingSlot[]>(
    slotsUrl,
    {
      key: [
        "admin-new-booking-slots",
        `${shop?.id}`,
        `${selectedDate.date}`,
        `${selectedService}`,
        `${selectedStaff}`,
      ],
      enabled: Boolean(slotsUrl),
      staleTime: 15_000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  );

  const { mutateAsync: createBooking, isPending } = useApiMutation(
    API_ENDPOINTS.bookings,
    "post",
  );

  const handleCreate = async () => {
    if (
      !shop?.id ||
      !selectedCustomer ||
      !selectedService ||
      !selectedDate
    ) {
      return;
    }

    await createBooking({
      shopId: shop.id,
      userId: selectedCustomer.id,
      serviceId: selectedService.id,
      staffId: selectedStaff?.id,
      date: selectedDate.date,
      startTime: selectedDate.time,
    }, {
      onSuccess: () => router.push("/admin/dashboard" as Route),
    });
  };

  const timelineSlots = useMemo(
    () =>
      slots.map((slot) => ({
        ...slot,
        startMin: timeToMinutes(slot.time),
      })),
    [slots],
  );

  const stepGuideMessage = !selectedService
    ? t("admin.newBooking.stepGuide_select_service")
    : !selectedCustomer
      ? t("admin.newBooking.stepGuide_select_customer")
      : t("admin.newBooking.stepGuide_select_others");

  const onSelectDate = (date: Date) => {
    setSelectedDate(prev => ({ ...prev, date: formatToDateString(date) }))
  }

  return (
    <div className="min-h-dvh bg-white text-slate-900 pb-100">
      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        <div className="relative flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute left-0 h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>

          <p className="w-4/5 text-center text-sm font-semibold tracking-wide">
            {t("admin.newBooking.title")}
          </p>
        </div>

        <div className="text-sm font-medium text-[#F49B33]">
          {stepGuideMessage}
        </div>

        <SelectService
          selectedService={selectedService}
          onSelect={setSelectedService}
        />

        {selectedService && (
          <SearchUserDialog
            shopId={shop?.id}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        )}

        {selectedService && selectedCustomer && (
          <>
            <SelectStaff
              selectedStaff={selectedStaff}
              setSelectedStaff={setSelectedStaff}
            />

            <section>
              <ScheduleDatePicker
                selectedDate={startOfDay(parse(selectedDate.date, 'yyyy-MM-dd', new Date()))}
                setSelectedDate={(date) => onSelectDate(date)}
                show="both"
              />
            </section>

            <section>
              <TimeSlotPicker
                slots={slots}
                selectedTime={selectedDate.time}
                durationMin={selectedService?.durationMin ?? 0}
                loading={slotsLoading}
                onSelect={(time) => {
                  setSelectedDate((prev) => ({
                    ...prev,
                    time,
                  }));
                }}
              />
            </section>
          </>
        )}

        {selectedService && selectedCustomer && (
          <SummarySection
            selectedDate={selectedDate}
            selectedService={selectedService}
            selectedCustomer={selectedCustomer}
            selectedStaff={selectedStaff}
            isPending={isPending}
            handleCreate={handleCreate}
          />
        )}
      </div>
    </div >
  );
}
