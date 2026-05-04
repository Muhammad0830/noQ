import Link from "next/link";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatPrice } from "@/lib/utils";
import { HistoryCardData } from "../bookings.types";
import {
  getStatusColor,
  getStatusIcon,
  getStatusLabel,
} from "./booking-status";

type Props = {
  filter: "ongoing" | "completed" | "cancelled";
  isHydrated: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  bookings: HistoryCardData[];
  onRetry: () => void;
  t: (key: string) => string;
};

const historySkeleton = (
  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80"
      >
        {/* Header Section Skeleton */}
        <div className="p-3.5 pb-3">
          <div className="flex items-start gap-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-5 w-32 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-48 rounded-md" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-3.5 h-px bg-slate-200" />

        {/* Status Section Skeleton */}
        <div className="flex items-center justify-between px-3.5 py-3">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-5 w-20 rounded-md" />
        </div>

        {/* Details Section Skeleton */}
        <div className="border-t border-slate-200 px-3.5 py-3">
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>

        {/* Actions/Reason Section Skeleton */}
        <div className="border-t border-slate-200 px-3.5 py-3">
          <div className="flex gap-2">
            <Skeleton className="h-9 flex-1 rounded-full" />
            <Skeleton className="h-9 flex-1 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function HistoryPanel({
  filter,
  isHydrated,
  isLoading,
  isError,
  errorMessage,
  bookings,
  onRetry,
  t,
}: Props) {
  const { locale } = useLanguage();
  const shopInitial = (bookingName?: string) =>
    bookingName?.trim() ? bookingName.trim().charAt(0).toUpperCase() : "";

  if (filter === "ongoing") {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[23px] font-semibold tracking-tight text-slate-900 sm:text-[30px]">
          {t("history.recentHistory")}
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600">
          {getStatusIcon(filter)}
          {getStatusLabel(filter, t)}
        </span>
      </div>

      {(!isHydrated || isLoading) && historySkeleton}

      {isHydrated && isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50/90 p-6">
          <p className="text-sm font-semibold text-red-700">
            {t("history.errorHistory")}
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
      )}

      <div className="space-y-3">
        {isHydrated && !isLoading && !isError && bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center">
            <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500" />
            <p className="text-sm text-slate-600">
              {t("history.emptySection")}
            </p>
          </div>
        ) : isHydrated && !isLoading && !isError ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(241,246,253,0.92))] shadow-[0_10px_20px_rgba(63,99,132,0.16)]"
            >
              {/* Header Section */}
              <div className="p-3.5 pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                    {booking.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={booking.image}
                        alt={booking.shopName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-700">
                        {shopInitial(booking.shopName)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">
                      {booking.shopName}
                    </h3>
                    <p className="text-sm text-slate-600">{booking.service}</p>
                    <p className="truncate text-xs text-slate-500">
                      {booking.address}
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="mx-3.5 h-px bg-slate-200" />

              {/* Status Section */}
              <div className="flex items-center justify-between px-3.5 py-3 pr-4">
                <div className="text-xs text-slate-500">
                  <span className="font-semibold">
                    {booking.date} • {booking.time}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {booking.duration} • {formatPrice(booking.price, locale)} {t("currency.som")}
                </div>
                <span
                  className={`absolute right-3 top-9 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${getStatusColor(booking.status)}`}
                >
                  {getStatusLabel(booking.status, t)}
                </span>
              </div>

              {/* Actions/Reason Section */}
              {booking.status === "completed" && (
                <div className="border-t border-slate-200 px-3.5 py-3">
                  <div className="flex gap-2">
                    <button className="h-9 flex-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-xs font-semibold text-white transition hover:bg-emerald-500/20">
                      {t("history.rateService")}
                    </button>
                    <Link
                      href={`/user/book/${booking.id}`}
                      className="flex h-9 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      {t("history.rebook")}
                    </Link>
                  </div>
                </div>
              )}

              {booking.status === "cancelled" && (
                <div className="border-t border-slate-200 px-3.5 py-3">
                  <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-500">
                      {t("history.reason")}:
                    </span>
                    <span className="ml-1">
                      {booking.cancelReason || t("history.noReason")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
