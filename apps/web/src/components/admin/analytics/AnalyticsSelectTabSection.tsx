import { cn } from "cn";
import { useTranslations } from "next-intl";
import { FC } from "react";
import AnalyticsSelectDate from "./AnalytictsSelectDate";

type TabsType = "last_week" | "last_month" | "last_year"

interface AnalyticsSelectTabSectionProps {
    analyticsTabs: TabsType[],
    activeTab: TabsType | null,
    startTime: Date;
    endTime: Date;
    onSelectTab: (tab: TabsType) => void;
    onSelectTime: (startTime: Date, endTime: Date) => void;
}

const AnalyticsSelectTabSection: FC<AnalyticsSelectTabSectionProps> = ({
    analyticsTabs,
    activeTab,
    startTime,
    endTime,
    onSelectTab,
    onSelectTime,
}) => {
    const t = useTranslations();

    return (
        <div className="flex items-center gap-2">
            <div className="flex-1 grid grid-cols-3 gap-2 md:gap-2.5 lg:gap-3">
                {analyticsTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onSelectTab(tab)}
                        type="button"
                        className={cn(
                            "w-full rounded-full px-2 py-2 md:py-2.5 lg:py-2.5 text-[9px] md:text-[10px] lg:text-[10px] font-semibold transition bg-white text-[#7b7b7b] shadow-[0_10px_24px_rgba(15,17,21,0.05)]",
                            activeTab === tab && "bg-[#f39c33] text-white shadow-[0_10px_24px_rgba(243,156,51,0.32)]",
                        )}
                    >
                        {t(`admin.analytics.${tab}`)}
                    </button>
                ))}
            </div>

            <AnalyticsSelectDate
                startTime={startTime}
                endTime={endTime}
                onSelectTime={onSelectTime}
            />
        </div>
    );
}

export default AnalyticsSelectTabSection;