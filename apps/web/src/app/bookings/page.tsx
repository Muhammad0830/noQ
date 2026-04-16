"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock3,
  MapPin,
  MessageSquare,
  Navigation,
  Scissors,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function MyBookings() {
  const [filter, setFilter] = useState<"ongoing" | "completed" | "cancelled">(
    "ongoing",
  );

  const bookings = [
    {
      id: 1,
      shopName: "Blade & Brush Studio",
      service: "Haircut & Beard Trim",
      staff: "John Parker",
      date: "2026-04-01",
      time: "2:30 PM",
      duration: "45 min",
      price: 50000,
      status: "ongoing",
      address: "125 Fashion Street, Arts District",
      city: "Los Angeles",
      district: "Arts District",
      subtitle: "LIVE STATUS",
      etaMin: 14,
      etaSec: 2,
    },
    {
      id: 2,
      shopName: "Zen Wellness Spa",
      service: "Swedish Massage",
      staff: "Emma Wilson",
      date: "2026-03-12",
      time: "11:00 AM",
      duration: "60 min",
      price: 200000,
      status: "completed",
      address: "Sunset Blvd 44, Los Angeles",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80",
    },
    {
      id: 3,
      shopName: "The Clean Cut",
      service: "Classic Cut",
      staff: "Oscar Lee",
      date: "2026-03-08",
      time: "11:00 AM",
      duration: "30 min",
      price: 60000,
      status: "cancelled",
      address: "Main Avenue 21, Los Angeles",
      cancelReason: "Provider unavailable due to emergency.",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=200&q=80",
    },
  ];

  const activeBooking = bookings.find((b) => b.status === "ongoing");
  const historyBookings = bookings.filter((b) => b.status !== "ongoing");
  const filteredHistory =
    filter === "ongoing"
      ? historyBookings
      : historyBookings.filter((b) => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "border border-emerald-400/35 bg-emerald-500/15 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300";
      case "completed":
        return "border border-green-400/35 bg-green-500/15 text-green-700 dark:border-green-400/25 dark:text-green-300";
      case "cancelled":
        return "border border-red-400/35 bg-red-500/15 text-red-700 dark:border-red-400/25 dark:text-red-300";
      default:
        return "border border-slate-300 bg-slate-200/80 text-slate-700 dark:border-slate-400/20 dark:bg-slate-600/30 dark:text-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Clock3 className="h-3.5 w-3.5" />;
      case "completed":
        return <Check className="h-3.5 w-3.5" />;
      case "cancelled":
        return <X className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-5 text-slate-900 dark:bg-[#02060d] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 w-full rounded-2xl border border-slate-200 bg-white/75 p-1.5 dark:border-white/10 dark:bg-white/3 sm:max-w-xl">
          <div className="grid grid-cols-3 gap-1">
            {[
              { key: "ongoing", label: "Ongoing" },
              { key: "completed", label: "Completed" },
              { key: "cancelled", label: "Cancelled" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() =>
                  setFilter(key as "ongoing" | "completed" | "cancelled")
                }
                className={`rounded-xl px-2 py-2.5 text-xs font-medium transition sm:text-sm ${
                  filter === key
                    ? "bg-slate-900 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:bg-white/12"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            {activeBooking && (
              <>
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[23px] font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[30px]">
                    Next Appointment
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusColor(activeBooking.status)}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-300" />
                    {activeBooking.subtitle}
                  </span>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fcff_0%,#eef4fa_100%)] shadow-[0_18px_40px_rgba(56,88,120,0.2)] dark:border-white/10 dark:bg-[linear-gradient(180deg,#111c2f_0%,#0a101b_100%)] dark:shadow-[0_18px_42px_rgba(0,0,0,0.45)]">
                  <div className="relative h-36 overflow-hidden border-b border-slate-200 bg-[linear-gradient(130deg,#cad7e2_0%,#9eb0bf_35%,#738b9d_100%)] dark:border-white/10 dark:bg-[linear-gradient(130deg,#9bb2c4_0%,#5f7282_35%,#2f3f4b_100%)] sm:h-44">
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,0.24)_25%,rgba(255,255,255,0.24)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2)_76%,transparent_77%,transparent)] bg-size-[30px_30px] opacity-30" />
                    <div className="absolute left-[58%] top-[43%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                      <MapPin className="h-3 w-3 text-emerald-300 dark:text-emerald-300" />
                      <span>{activeBooking.city}</span>
                    </div>
                    <div className="absolute left-[45%] top-[40%] h-2.5 w-2.5 rounded-full bg-cyan-300 ring-4 ring-cyan-300/30" />
                    <div className="absolute right-4 top-4 rounded-full bg-black/40 px-2 py-1 text-[10px] text-white/90 backdrop-blur-sm">
                      ETA 0.8 MILE
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
                          {activeBooking.service}
                        </p>
                        <h3 className="mt-1 text-[32px] font-semibold leading-none tracking-tight text-slate-900 dark:text-white sm:text-[40px]">
                          {activeBooking.shopName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300/90 sm:text-base">
                          {activeBooking.address}
                        </p>
                      </div>
                      <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/15 text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-300/35 dark:bg-emerald-400/15 dark:text-emerald-300 dark:hover:bg-emerald-400/20">
                        <Scissors className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="my-4 h-px w-full bg-linear-to-r from-slate-200/0 via-slate-400/40 to-slate-200/0 dark:from-white/0 dark:via-white/20 dark:to-white/0" />

                    <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_8px_22px_rgba(16,185,129,0.34)] dark:bg-emerald-400 dark:text-[#032018] dark:shadow-[0_8px_22px_rgba(0,255,190,0.32)]">
                          <span className="text-[22px] font-semibold leading-none">
                            {activeBooking.etaMin}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.09em]">
                            Min
                          </span>
                        </div>
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-900 dark:border-white/12 dark:bg-white/5 dark:text-white">
                          <span className="text-[22px] font-semibold leading-none">
                            {String(activeBooking.etaSec).padStart(2, "0")}
                          </span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500 dark:text-slate-300">
                            Sec
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-[0.11em] text-slate-500 dark:text-slate-400">
                          Starts At
                        </p>
                        <p className="text-[20px] font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[30px]">
                          Today, {activeBooking.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/bookings/${activeBooking.id}`}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-linear-to-r from-emerald-500 to-cyan-500 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(16,185,129,0.35)] transition hover:brightness-105 dark:from-emerald-400 dark:to-cyan-400 dark:text-[#032018] dark:shadow-[0_10px_26px_rgba(0,255,190,0.35)]"
                      >
                        <Navigation className="h-4 w-4" />
                        Get Directions
                      </Link>
                      <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10">
                        <MessageSquare className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[23px] font-semibold tracking-tight text-slate-900 dark:text-white sm:text-[30px]">
                Recent History
              </h2>
              {filter !== "ongoing" && (
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1 text-[10px] uppercase tracking-widest text-slate-600 dark:border-white/15 dark:bg-white/5 dark:text-slate-300">
                  {getStatusIcon(filter)}
                  {filter}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {filteredHistory.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white/75 p-6 text-center dark:border-white/10 dark:bg-white/3">
                  <Calendar className="mx-auto mb-3 h-8 w-8 text-slate-500 dark:text-slate-500" />
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Tanlangan bo‘limda buyurtma topilmadi.
                  </p>
                </div>
              ) : (
                filteredHistory.map((booking) => (
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
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[18px] font-semibold tracking-tight text-slate-900 dark:text-white">
                          {booking.shopName}
                        </h3>
                        <p className="truncate text-sm text-slate-600 dark:text-slate-300/90">
                          {booking.service} •{" "}
                          {new Date(booking.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                          })}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${getStatusColor(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {booking.status === "completed" && (
                      <div className="flex gap-2">
                        <button className="h-9 flex-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:text-emerald-300">
                          Rate Service
                        </button>
                        <Link
                          href={`/book/${booking.id}`}
                          className="flex h-9 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-white/15 dark:bg-white/6 dark:text-slate-200 dark:hover:bg-white/10"
                        >
                          Rebook
                        </Link>
                      </div>
                    )}

                    {booking.status === "cancelled" && (
                      <div className="rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-[11px] leading-relaxed text-slate-700 dark:border-white/10 dark:bg-black/25 dark:text-slate-300">
                        <span className="mr-1 text-slate-500 dark:text-slate-400">
                          REASON:
                        </span>
                        {booking.cancelReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
