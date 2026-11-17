"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { FC, useMemo, useState } from "react";
import { useTranslations } from "use-intl";
import { cn } from "cn";
import { addDays, startOfDay } from "@noq/shared";

const VISIBLE_DAYS = 5;
const MAX_DAYS_AHEAD = 90;
const MAX_DAYS_BEFORE = 90;

type DatePickerType = "prev_only" | "next_only" | "both";

interface ScheduleDatePickerProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
    show?: DatePickerType;
    maxDaysBefore?: number;
    maxDaysAhead?: number;
    visibleDays?: number;
}

const ScheduleDatePicker: FC<ScheduleDatePickerProps> = ({
    selectedDate,
    setSelectedDate,
    show = "next_only",
    visibleDays = VISIBLE_DAYS,
    maxDaysBefore = show === "next_only" ? 0 : MAX_DAYS_BEFORE,
    maxDaysAhead = show === "prev_only" ? 0 : MAX_DAYS_AHEAD,
}) => {
    const t = useTranslations();

    const [startOffset, setStartOffset] = useState(0);

    const visibleDates = useMemo(() => {
        const today = startOfDay(new Date());
        const baseOffset = show === "prev_only"
            ? startOffset - visibleDays + 1
            : startOffset;

        return Array.from({ length: visibleDays }, (_, index) =>
            addDays(today, baseOffset + index)
        );
    }, [startOffset, show, visibleDays]);

    const maxStartOffset = Math.max(
        0,
        maxDaysAhead - visibleDays + 1
    );

    const minStartOffset = Math.min(
        0, - maxDaysBefore
    );

    const canGoPrevious = startOffset > minStartOffset;
    const canGoNext = startOffset < maxStartOffset;

    const showPreviousDates = () => {
        setStartOffset((current) =>
            Math.max(minStartOffset, current - visibleDays)
        );
    };

    const showNextDates = () => {
        setStartOffset((current) =>
            Math.min(maxStartOffset, current + visibleDays)
        );
    };

    const yearLabel = visibleDates.at(-1)?.getFullYear();
    const monthLabel = visibleDates.at(-1)?.toLocaleString('en-US', { month: 'long' }) ?? '';
    const shortWeekDayLabel = (date: Date) => date.toLocaleDateString("en-US", {
        weekday: "short",
    })

    return (
        <section className="mb-6">
            <div className="flex flex-col items-center gap-2">
                <div className="w-full flex items-center justify-between mb-3">
                    <h3 className="flex gap-1 text-sm font-semibold">
                        <span>{yearLabel}</span>
                        <span>{t(`months.${monthLabel.toLowerCase()}`)}</span>
                    </h3>
                    <div className="flex gap-2">
                        <button
                            onClick={showPreviousDates}
                            className={cn(
                                "h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-500",
                                !canGoPrevious && "opacity-50"
                            )}
                            disabled={!canGoPrevious}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={showNextDates}
                            className={cn(
                                "h-7 w-7 rounded-full border border-slate-300 flex items-center justify-center text-slate-500",
                                !canGoNext && "opacity-50"
                            )}
                            disabled={!canGoNext}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="w-full grid grid-cols-5 gap-2">
                    {visibleDates.map((date) => {
                        const isSelected = selectedDate.getTime() === date.getTime();

                        return (
                            <button
                                key={date.toISOString()}
                                type="button"
                                onClick={() => setSelectedDate(date)}
                                className={cn(
                                    "rounded-xl py-2 text-center border",
                                    isSelected ? "bg-[#F49B33] text-white border-[#F49B33]" : "bg-white border-[#ead8c3] text-slate-700"
                                )}
                                aria-pressed={isSelected}
                            >
                                <p className="text-[10px] uppercase">
                                    {t(`weekdays.${shortWeekDayLabel(date)}`)}
                                </p>

                                <p className="text-lg font-semibold leading-5 mt-1">
                                    {date.getDate()}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default ScheduleDatePicker;