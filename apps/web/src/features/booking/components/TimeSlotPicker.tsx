
"use client";

import type { ScheduleSlot } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { addMinutes } from "../utils";
import { useTranslations } from "next-intl";

interface TimeSlotPickerProps {
    slots: ScheduleSlot[];
    selectedTime: string | null;
    durationMin: number;
    loading?: boolean;
    onSelect: (time: string) => void;
}

export function TimeSlotPicker({
    slots,
    selectedTime,
    durationMin,
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
            <div className="rounded-2xl border border-[#f1c894]/80 bg-white/80 px-3 py-4 text-center text-sm text-slate-600">
                {t("user.booking.noSlots")}
            </div>
        );
    }

    return (
        <div className="max-h-72 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
                {slots.map((slot) => {
                    const isSelected = selectedTime === slot.time;
                    const canSelect = slot.type === "available";

                    const status = isSelected ? "selected" : slot.type;

                    const statusLabel = {
                        selected: t("user.booking.selected"),
                        available: t("user.booking.availableSlot"),
                        break: t("user.booking.break"),
                        booked: t("user.booking.alreadyReserved"),
                    }[status];

                    const colorClasses = {
                        selected: "text-white",
                        available: "text-[#F49B33]",
                        break: "text-[#8a5620]",
                        booked: "text-slate-500",
                    }[status];

                    const containerClasses = {
                        selected:
                            "border-[#F49B33] bg-[#F49B33] text-white",
                        available:
                            "border-[#f1c894] bg-white/95 text-[#F49B33] hover:border-[#F49B33] hover:bg-[#fff3e6]",
                        break:
                            "border-[#f1c894] bg-[#fff3e6] text-[#8a5620] cursor-not-allowed",
                        booked:
                            "border-slate-200 bg-slate-100/90 text-slate-500 cursor-not-allowed",
                    }[status];

                    const endTime = addMinutes(slot.time, durationMin);

                    return (
                        <button
                            key={slot.id}
                            type="button"
                            aria-pressed={isSelected}
                            disabled={!canSelect}
                            onClick={() => onSelect(slot.time)}
                            className={`min-h-18 rounded-3xl border px-3 py-2 text-center transition-all disabled:cursor-not-allowed ${containerClasses}`}
                        >
                            <span
                                className={`block text-[14px] leading-none font-bold tracking-tight ${colorClasses}`}
                            >
                                {slot.time} - {endTime}
                            </span>

                            <span
                                className={`mt-1 block text-[8px] font-semibold uppercase tracking-[0.08em] opacity-95 ${colorClasses}`}
                            >
                                {statusLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
