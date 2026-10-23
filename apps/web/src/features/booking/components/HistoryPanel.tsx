"use client";

import { Calendar } from "lucide-react";
import { BookingTabs, HistoryCardData } from "../types";
import { useTranslations } from "next-intl";
import HistoryPanelSkeleton from "./HistoryPanelSkeleton";
import HistoryPanelBookingCard from "./HistoryPanelBookingCard";

type Props = {
  isLoading: boolean;
  isCancelledError: boolean;
  isCompletedError: boolean;
  completedDataErrorMessage?: string;
  cancelledDataErrorMessage?: string;
  bookings: HistoryCardData[];
  selectedTab: BookingTabs.COMPLETED | BookingTabs.CANCELLED
};

export default function HistoryPanel({
  isLoading,
  isCancelledError,
  isCompletedError,
  completedDataErrorMessage,
  cancelledDataErrorMessage,
  bookings,
  selectedTab
}: Props) {
  const t = useTranslations()

  const getShopInitial = (bookingName?: string) =>
    bookingName?.trim() ? bookingName.trim().charAt(0).toUpperCase() : "";

  const errorMessgae = selectedTab === BookingTabs.COMPLETED
    ? completedDataErrorMessage : cancelledDataErrorMessage;

  if (isLoading) {
    return <HistoryPanelSkeleton />;
  }

  if (isCancelledError || isCompletedError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/90 p-6">
        <p className="text-sm font-semibold text-red-700">
          {t("user.history.errorHistory")}
        </p>

        <p className="mt-1 text-xs text-red-700/80">{errorMessgae}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500" />

        <p className="text-sm text-slate-600">
          {t("user.history.emptySection")}
        </p>
      </div>
    );
  }

  return bookings.map((booking) => (
    <HistoryPanelBookingCard
      key={booking.id}
      booking={booking}
      getShopInitial={getShopInitial} />
  ))
}
