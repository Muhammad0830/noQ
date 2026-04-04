import Link from "next/link";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
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
        className="rounded-2xl border border-slate-200 bg-white/80 p-3.5 dark:border-white/10 dark:bg-white/5"
      >
        <div className="mb-3 flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-44 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
            <Skeleton className="h-3 w-64 rounded-md" />
          </div>
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
        <Skeleton className="h-9 w-full rounded-full" />
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
  if (filter === "ongoing") {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[23px] font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[30px]">
          {t("history.recentHistory")}
        </h2>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
          {getStatusIcon(filter)}
          {getStatusLabel(filter, t)}
        </span>
      </div>

      {(!isHydrated || isLoading) && historySkeleton}

      {isHydrated && isError && (
        <div className="rounded-3xl border border-red-200 bg-red-50/90 p-6 dark:border-red-400/30 dark:bg-red-500/10">
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">
            {t("history.errorHistory")}
          </p>
          <p className="mt-1 text-xs text-red-700/80 dark:text-red-300/80">
            {errorMessage}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-3 rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-300/40 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
          >
            {t("common.retry")}
          </button>
        </div>
      )}

      <div className="space-y-3">
        {isHydrated && !isLoading && !isError && bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center dark:border-white/10 dark:bg-white/3">
            <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500 dark:text-slate-500" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t("history.emptySection")}
            </p>
          </div>
        ) : isHydrated && !isLoading && !isError ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(241,246,253,0.92))] p-3.5 shadow-[0_10px_20px_rgba(63,99,132,0.16)] dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] dark:shadow-[0_10px_22px_rgba(0,0,0,0.35)]"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-slate-200 dark:border-white/10 dark:bg-slate-700">
                  {booking.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={booking.image}
                      alt={booking.shopName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      {t("history.noImage")}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-[18px] font-semibold tracking-tight text-slate-900 dark:text-white">
                    {booking.shopName}
                  </h3>
                  <p className="truncate text-sm text-slate-600 dark:text-slate-300/90">
                    {booking.service} • {booking.date} • {booking.time}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {booking.address}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getStatusColor(booking.status)}`}
                >
                  {getStatusLabel(booking.status, t)}
                </span>
              </div>

              {booking.status === "completed" && (
                <div className="flex gap-2">
                  <button className="h-9 flex-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:text-emerald-300">
                    {t("history.rateService")}
                  </button>
                  <Link
                    href={`/book/${booking.id}`}
                    className="flex h-9 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
                  >
                    {t("history.rebook")}
                  </Link>
                </div>
              )}

              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {booking.duration} • ${booking.price.toFixed(2)}
              </div>

              {booking.status === "cancelled" && (
                <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-700 dark:border-white/10 dark:bg-black/25 dark:text-slate-300">
                  <span className="mr-1 text-slate-500 dark:text-slate-400">
                    {t("history.reason")}:
                  </span>
                  {booking.cancelReason || t("history.noReason")}
                </div>
              )}
            </div>
          ))
        ) : null}
      </div>
    </div>
  );
}
