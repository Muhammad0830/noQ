"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from "react";
import { SelectedDateType } from "../types";
import { getStringTimeFromDate } from "../utils";
import { useTranslations } from "use-intl";
import { cn } from "cn";

const VISIBLE_DAYS = 5;
const MAX_DAYS_AHEAD = 90;

interface ScheduleDatePickerProps {
    selectedDate: SelectedDateType;
    setSelectedDate: Dispatch<SetStateAction<SelectedDateType>>;
}

const ScheduleDatePicker: FC<ScheduleDatePickerProps> = ({
    selectedDate,
    setSelectedDate,
}) => {
    const t = useTranslations();

    const [startOffset, setStartOffset] = useState(0);

    const getDateAtOffset = useCallback((offset: number) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        return date;
    }, []);

    const visibleDates = useMemo(() => {
        return Array.from({ length: VISIBLE_DAYS }, (_, index) =>
            getDateAtOffset(startOffset + index)
        );
    }, [startOffset, getDateAtOffset]);

    const maxStartOffset = Math.max(
        0,
        MAX_DAYS_AHEAD - VISIBLE_DAYS + 1
    );

    const canGoPrevious = startOffset > 0;
    const canGoNext = startOffset < maxStartOffset;

    const showPreviousDates = () => {
        setStartOffset((current) =>
            Math.max(0, current - VISIBLE_DAYS)
        );
    };

    const showNextDates = () => {
        setStartOffset((current) =>
            Math.min(maxStartOffset, current + VISIBLE_DAYS)
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
                        const isSelected =
                            selectedDate.date === getStringTimeFromDate(date);

                        return (
                            <button
                                key={date.toISOString()}
                                type="button"
                                onClick={() => setSelectedDate({ time: null, date: getStringTimeFromDate(date) })}
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