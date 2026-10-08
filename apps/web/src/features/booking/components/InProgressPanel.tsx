import { Calendar } from "lucide-react";
import { InProgressBookingCardData } from "../types";
import { useTranslations } from "next-intl";
import InProgressPanelSkeleton from "./InProgressPanelSkeleton";
import InProgressBookingCard from "./InProgressBookingsCard";

type Props = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  bookings: InProgressBookingCardData[];
  isCancellingBooking?: boolean;
  onCancelBooking: (bookingId: string) => void;
};

export default function InProgressPanel({
  bookings,
  isLoading,
  isError,
  errorMessage,
  isCancellingBooking,
  onCancelBooking,
}: Props) {
  const t = useTranslations()

  if (isLoading) {
    return <InProgressPanelSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/90 p-6">
        <p className="text-sm font-semibold text-red-700">
          {t("user.history.errorInProgress")}
        </p>
        <p className="mt-1 text-xs text-red-700/80">{errorMessage}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-600">{t("user.history.emptyInProgress")}</p>
      </div>
    )
  }

  return bookings.map(booking => {
    return (
      <InProgressBookingCard
        key={booking.id}
        booking={booking}
        isCancelling={isCancellingBooking}
        onCancel={onCancelBooking} />
    )
  });
}
