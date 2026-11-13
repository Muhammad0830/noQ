import { FC, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { ChevronDown } from "lucide-react";
import { Calendar } from "../../ui/calendar";
import { cn, monthNames } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { uz, uzCyrl, ru } from "date-fns/locale"
import platformConfig from "@/config/platform";

interface DashboardSelectDateProps {
    selectedDate: Date;
    onSelectDate: (date: Date) => void;
}

const dateFnsLocales = {
    "uz-latn": uz,
    "uz-cyrl": uzCyrl,
    "ru": ru,
}

const DashboardSelectDate: FC<DashboardSelectDateProps> = ({
    selectedDate,
    onSelectDate
}) => {
    const t = useTranslations();
    const activeLanguage = useLocale()

    const [isOpen, setIsOpen] = useState(false)

    const selectDate = (date: Date | undefined) => {
        if (date) {
            onSelectDate(date);
        }
    }

    const currentLocaleKey = (activeLanguage in platformConfig.supportedLocales
        ? activeLanguage
        : platformConfig.defaultLocale) as keyof typeof platformConfig.supportedLocales

    const currentLocale = dateFnsLocales[currentLocaleKey]

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    onClick={() => setIsOpen((value) => !value)}
                    className="flex items-center gap-2 rounded-full border px-3 py-2 text-sm"
                >
                    <span className="text-sm text-[#f49b33]">
                        {t(`months.${monthNames[selectedDate.getMonth()]}`)}
                    </span>

                    <ChevronDown className={cn(
                        "h-4 w-4 text-gray-500 transition-transform duration-150",
                        isOpen && "rotate-180"
                    )} />
                </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-auto p-0 rounded-lg">
                <Calendar locale={currentLocale} mode="single" selected={selectedDate} onSelect={selectDate} />
            </PopoverContent>
        </Popover>
    );
}

export default DashboardSelectDate;