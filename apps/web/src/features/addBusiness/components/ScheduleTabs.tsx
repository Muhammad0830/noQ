import { CalendarClock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction } from "react";
import { SchedulePanelTabs } from "../types";
import { cn } from "cn";

interface ScheduleTabsProps {
    activeTab: SchedulePanelTabs;
    setActiveTab: Dispatch<SetStateAction<SchedulePanelTabs>>;
}

const ScheduleTabs: FC<ScheduleTabsProps> = ({
    activeTab,
    setActiveTab,
}) => {
    const t = useTranslations();

    return (
        <section className="mb-3 grid grid-cols-2 gap-2">
            <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors",
                    activeTab === "schedule" ? "border-[#f09a35] bg-[#f09a35] text-white" : "border-[#d9dbe0] bg-white text-[#97a0ab]"
                )}
            >
                <CalendarClock className="h-4 w-4" />
                {t("admin.schedule.tab.schedule")}
            </button>

            <button
                type="button"
                onClick={() => setActiveTab("exceptions")}
                className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-2xl border py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors",
                    activeTab === "exceptions" ? "border-[#f09a35] bg-[#f09a35] text-white" : "border-[#d9dbe0] bg-white text-[#97a0ab]"
                )}
            >
                <CalendarClock className="h-4 w-4" />
                {t("admin.schedule.tab.exceptions")}
            </button>
        </section>
    );
}

export default ScheduleTabs;