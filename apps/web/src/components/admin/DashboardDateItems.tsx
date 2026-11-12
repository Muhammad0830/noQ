import { FC } from "react";
import { cn, weekdayShort } from "@/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";
import { useTranslations } from "next-intl";

interface DashboardDateItemsProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

const DashboardDateItems: FC<DashboardDateItemsProps> = ({
    selectedDate,
    onSelectDate,
}) => {
    const t = useTranslations();

    const cursor = startOfMonth(selectedDate);

    const dateList: Date[] = [];

    while (cursor <= endOfMonth(selectedDate)) {
        dateList.push(new Date(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto overflow-y-hidden p-1 md:gap-2.5 lg:gap-3 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {dateList.map((day) => {
                const isToday = day.toDateString() === new Date().toDateString();
                const isSelected = day.toDateString() === selectedDate.toDateString();

                return (
                    <button
                        key={day.toDateString()}
                        type="button"
                        onClick={() => {
                            const nextDate = new Date(day);
                            nextDate.setHours(0, 0, 0, 0);
                            onSelectDate(nextDate);
                        }}
                        aria-pressed={isSelected}
                        className={cn(
                            "flex min-w-14 flex-col items-center justify-center rounded-2xl border transition-all duration-200 md:min-w-14 lg:min-w-16 border-transparent bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-[#f49b33] px-3 py-2.5 md:px-3.5 md:py-2.5 lg:px-4 lg:py-3",
                            isSelected && "border-orange-300 bg-[#f49b33] text-white ring-orange-200",
                        )}
                    >
                        <div className="uppercase text-[10px] opacity-80 md:text-[11px] lg:text-xs">
                            {t(`weekdays.${weekdayShort[day.getDay()]}`)}
                        </div>

                        <div className="font-semibold" >{day.getDate()}</div>

                        {isToday && (
                            <div className={cn(
                                "mt-1 h-1 w-1 rounded-full md:mt-1.5 lg:mt-2",
                                isSelected ? "bg-white" : "bg-[#f49b33]",
                            )} />
                        )}
                    </button>
                );
            })}
        </div >
    );
}

export default DashboardDateItems;