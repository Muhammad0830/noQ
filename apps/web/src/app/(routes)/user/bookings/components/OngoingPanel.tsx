import Link from "next/link";
import { Calendar, Navigation, Scissors, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { OngoingBookingCardData } from "../bookings.types";
import { getStatusColor, getStatusLabel } from "./booking-status";

type Props = {
  filter: "ongoing" | "completed" | "cancelled";
  showHeader?: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  activeBooking: OngoingBookingCardData | null;
  onRetry: () => void;
  onCancelBooking: (bookingId?: string) => void;
  isCancellingBooking?: boolean;
  t: (key: string) => string;
};

const ongoingSkeleton = (
  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/85">
    {/* Image Skeleton */}
    <Skeleton className="h-36 w-full rounded-none sm:h-44" />

    <div className="p-4 sm:p-5">
      {/* Header Section */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-20 rounded-md" />
          <Skeleton className="h-8 w-48 rounded-md" />
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-slate-200" />

      {/* Countdown & Start Time Section */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-14 w-14 rounded-2xl" />
          <Skeleton className="h-14 w-14 rounded-2xl" />
        </div>
        <div className="space-y-1.5 text-right">
          <Skeleton className="h-3 w-20 rounded-md" />
          <Skeleton className="h-6 w-24 rounded-md" />
        </div>
      </div>

      {/* Service Details Box */}
      <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300/70 bg-white/75 px-3 py-2">
        <Skeleton className="h-4 w-24 rounded-md" />
        <Skeleton className="h-4 w-28 rounded-md" />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-12 flex-1 rounded-full" />
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    </div>
  </div>
);

export default function OngoingPanel({
  filter,
  showHeader = true,
  isHydrated,
  isLoading,
  isError,
  errorMessage,
  activeBooking,
  onRetry,
  onCancelBooking,
  isCancellingBooking,
  t,
}: Props) {
  const { locale } = useLanguage();
  if (filter !== "ongoing") {
    return null;
  }

  if (!isHydrated || isLoading) {
    return ongoingSkeleton;
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50/90 p-6">
        <p className="text-sm font-semibold text-red-700">
          {t("history.errorOngoing")}
        </p>
        <p className="mt-1 text-xs text-red-700/80">{errorMessage}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
        >
          {t("common.retry")}
        </button>
      </div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center">
        <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500" />
        <p className="text-sm text-slate-600">{t("history.emptyOngoing")}</p>
      </div>
    );
  }

  return (
    <>
      {showHeader && (
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[23px] font-semibold tracking-tight text-[#F49B33] sm:text-[30px]">
            {t("history.nextAppointment")}
          </h2>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white ${getStatusColor(activeBooking.status)}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
            {getStatusLabel(activeBooking.subtitle, t)}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fcff_0%,#eef4fa_100%)] shadow-[0_18px_40px_rgba(56,88,120,0.2)]">
        <div className="relative h-36 overflow-hidden border-b border-slate-200 bg-[linear-gradient(130deg,#cad7e2_0%,#9eb0bf_35%,#738b9d_100%)] sm:h-44">
          {activeBooking.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeBooking.image}
              alt={activeBooking.shopName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>

        <div className="p-4 sm:p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.15em] text-[#F49B33]">
                {activeBooking.service}
              </p>
              <h3 className="mt-1 text-[32px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[40px]">
                {activeBooking.shopName}
              </h3>
              <p className="mt-2 text-sm text-slate-700 sm:text-base">
                {activeBooking.address}
              </p>
            </div>
            <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F49B33]/55 bg-[#F49B33] text-white shadow-[0_8px_18px_rgba(244,155,51,0.32)] transition hover:bg-[#e28a20]">
              <Scissors className="h-5 w-5" />
            </button>
          </div>

          <div className="my-4 h-px w-full bg-linear-to-r from-slate-200/0 via-slate-400/40 to-slate-200/0" />

          <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-2.5">
              {activeBooking.remainingDays !== null ? (
                <div className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl bg-[#F49B33] text-white shadow-[0_8px_22px_rgba(244,155,51,0.34)]">
                  <span className="text-[22px] font-semibold leading-none">
                    {activeBooking.remainingDays}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.09em]">
                    {t("history.time.days")}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[#F49B33] text-white shadow-[0_8px_22px_rgba(244,155,51,0.34)]">
                    <span className="text-[22px] font-semibold leading-none">
                      {activeBooking.remainingHours}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.09em]">
                      {t("history.time.hour")}
                    </span>
                  </div>
                  <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-900">
                    <span className="text-[22px] font-semibold leading-none">
                      {activeBooking.remainingMinutes}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">
                      {t("history.time.min")}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.11em] text-slate-500">
                {t("history.startsAt")}
              </p>
              <p className="text-[20px] font-semibold tracking-tight text-slate-900 sm:text-[30px]">
                {activeBooking.startLabel}
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300/70 bg-white/75 px-3 py-2">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              {t("history.serviceDetails")}
            </p>
            <p className="text-sm font-semibold text-slate-800">
              {activeBooking.duration} • {formatPrice(activeBooking.price, locale)} {t("currency.som")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/user/bookings/directions`}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#F49B33] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,155,51,0.35)] transition hover:bg-[#e28a20]"
            >
              <Navigation className="h-4 w-4" />
              {t("history.getDirections")}
            </Link>
            <button
              type="button"
              onClick={() => onCancelBooking(activeBooking.id)}
              disabled={isCancellingBooking}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Cancel booking"
            >
              <XCircle
                className={`h-5 w-5 ${isCancellingBooking ? "animate-pulse" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
