import { formatToTimeString } from "@noq/shared";
import { useTranslations } from "next-intl";
import { FC } from "react";

interface DashboardNowMarkerProps {
    currentDate: Date;
}

const DashboardNowMarker: FC<DashboardNowMarkerProps> = ({
    currentDate
}) => {
    const t = useTranslations();

    return (
        <div
            className="pointer-events-none absolute left-0 right-0 z-20 transition-all duration-300 -translate-y-1/2"
            style={{ top: "60%" }}
        >
            <div className="grid grid-cols-[40px_12px_minmax(0,1fr)] items-center gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2">
                <div className="flex justify-end relative">
                    <span className="absolute bottom-full left-0 right-0 text-center text-[10px] text-primary font-semibold capitalize">{t("common.now")}</span>
                    <span className="z-30 inline-flex rounded-full bg-[#f49b33] px-2 py-0.5 text-[8px] font-bold text-white shadow-sm md:px-2 md:py-0.5 lg:px-2.5 lg:py-0.5 lg:text-[9px]">
                        {formatToTimeString(currentDate)}
                    </span>
                </div>

                <div className="relative h-3">
                    <span className="absolute left-1/2 top-1/2 z-30 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f49b33] ring-4 ring-orange-100" />
                </div>

                <div className="relative h-3">
                    <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-orange-300" />
                </div>
            </div>
        </div>
    );
}

export default DashboardNowMarker;