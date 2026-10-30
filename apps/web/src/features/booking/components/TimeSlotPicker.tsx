"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { addMinutes } from "../utils";
import { useTranslations } from "next-intl";
import { BookingSlot, SlotStatus } from "@noq/shared";
import { cn } from "cn";
import { Diff } from "lucide-react";

interface TimeSlotPickerProps {
    slots: BookingSlot[];
    selectedTime: string | null;
    durationMin: number;
    loading?: boolean;
    onSelect: (time: string) => void;
}

const statusLabel = [
    "user.booking.availableSlot",
    "user.booking.alreadyReserved",
    "user.booking.break",
    "user.booking.break",
    "user.booking.selected",
];

const colorClasses = [
    "text-[#F49B33]",
    "text-slate-500",
    "text-[#8a5620]",
    "text-[#8a5620]",
    "text-white",
];

const containerClasses = [
    "border-[#f1c894] bg-white/95 text-[#F49B33] hover:border-[#F49B33] hover:bg-[#fff3e6]",
    "border-slate-200 bg-slate-100/90 text-slate-500 cursor-not-allowed",
    "border-[#f1c894] bg-[#fff3e6] text-[#8a5620] cursor-not-allowed",
    "border-[#f1c894] bg-[#fff3e6] text-[#8a5620] cursor-not-allowed",
    "border-[#F49B33] bg-[#F49B33] text-white",
]

export function TimeSlotPicker({
    slots,
    selectedTime,
    loading = false,
    onSelect,
}: TimeSlotPickerProps) {
    const t = useTranslations()

    if (loading) {
        return (
            <div className="max-h-72 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            key={index}
                            className="min-h-18 rounded-3xl border border-[#f1c894]/80 p-3"
                        >
                            <Skeleton className="mx-auto h-4 w-28 rounded bg-[#fde5c7]" />
                            <Skeleton className="mx-auto mt-2 h-2 w-16 rounded bg-[#fde5c7]" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <section className="mb-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[20px] leading-none font-bold text-slate-900">
                        {t("user.booking.timeline")}
                    </h3>
                    <p className="text-[10px] tracking-[0.16em] text-[#F49B33] uppercase">
                        {t("user.booking.liveSelection")}
                    </p>
                </div>

                <div className="rounded-2xl border border-[#f1c894]/80 bg-white/80 px-3 py-4 text-center text-sm text-slate-600">
                    {t("user.booking.noSlots")}
                </div>
            </section>
        );
    }

    return (
        <section className="mb-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-[20px] leading-none font-bold text-slate-900">
                    {t("user.booking.timeline")}
                </h3>
                <p className="text-[10px] tracking-[0.16em] text-[#F49B33] uppercase">
                    {t("user.booking.liveSelection")}
                </p>
            </div>

            <div className="rounded-xl border border-[#f1c894]/80 bg-white p-2">
                <div className="grid grid-cols-2 gap-2">
                    {slots.map((slot) => {
                        const endTime = addMinutes(slot.time, slot.durationMin);
                        const isSelected = selectedTime === slot.time;

                        return (
                            <button
                                key={slot.id}
                                type="button"
                                aria-pressed={isSelected}
                                disabled={slot.status !== SlotStatus.AVAILABLE}
                                onClick={() => onSelect(slot.time)}
                                className={cn(
                                    "relative min-h-18 rounded-xl border px-3 py-2 text-center transition-all disabled:cursor-not-allowed",
                                    containerClasses[isSelected ? 4 : slot.status]
                                )}
                            >
                                <span
                                    className={cn(
                                        "block text-[14px] leading-none font-bold tracking-tight ",
                                        colorClasses[isSelected ? 4 : slot.status]
                                    )}
                                >
                                    {slot.time} - {endTime}
                                </span>

                                <span
                                    className={cn(
                                        "mt-1 block text-[8px] font-semibold uppercase tracking-[0.08em] opacity-95",
                                        colorClasses[isSelected ? 4 : slot.status]
                                    )}
                                >
                                    {t(statusLabel[isSelected ? 4 : slot.status])}
                                </span>

                                {slot.bufferTime && (
                                    <span className="flex items-center gap-1  text-xs absolute bottom-1 right-2">
                                        <div className="flex items-center">
                                            <Diff className="w-2.5 h-2.5" />
                                            <span>{slot.bufferTime}</span>
                                        </div>
                                        <span>{t("user.services.duration")}</span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </section >
    );
}
