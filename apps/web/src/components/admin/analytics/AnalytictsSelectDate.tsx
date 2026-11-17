import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import platformConfig from "@/config/platform";
import { addYears } from "@noq/shared";
import { format } from "date-fns";
import { ru, uz, uzCyrl } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

interface AnalyticsSelectDateProps {
    startTime: Date;
    endTime: Date;
    onSelectTime: (startTime: Date, endTime: Date) => void;
}

const dateFnsLocales = {
    "uz-latn": uz,
    "uz-cyrl": uzCyrl,
    "ru": ru,
}

const AnalyticsSelectDate: FC<AnalyticsSelectDateProps> = ({
    startTime,
    endTime,
    onSelectTime,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    const currentLocaleKey = (locale in platformConfig.supportedLocales
        ? locale
        : platformConfig.defaultLocale) as keyof typeof platformConfig.supportedLocales

    const currentLocale = dateFnsLocales[currentLocaleKey]

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm bg-white"
                >
                    <CalendarIcon className="w-4 h-4" />
                </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto p-0 rounded-lg">
                <Calendar
                    mode="range"
                    captionLayout="dropdown"
                    startMonth={new Date(2020, 0)}
                    endMonth={addYears(new Date(), 1)}
                    formatters={{
                        formatMonthDropdown: (date) => t(`months.${format(date, "MMMM").toLowerCase()}`),
                        formatCaption: (date) => `${t(`months.${format(date, "MMMM").toLowerCase()}`)} ${date.getFullYear()}`,
                    }}
                    locale={currentLocale}
                    numberOfMonths={2}
                    defaultMonth={startTime}
                    selected={{ from: startTime, to: endTime }}
                    onSelect={(value) => {
                        if (value?.from && value?.to) {
                            onSelectTime(value.from, value.to)
                        }
                    }} />
            </PopoverContent>
        </Popover>
    );
}

export default AnalyticsSelectDate;