import { PeakHour } from "@noq/shared";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

interface AnalyticsPeakHoursSectionProps {
    data: PeakHour[];
    isLoading: boolean;
    isError: boolean;
    error: AxiosError | null;
}

const AnalyticsPeakHoursSection: FC<AnalyticsPeakHoursSectionProps> = ({
    data,
    isLoading,
    isError,
    error,
}) => {
    const t = useTranslations();

    const peakHoursData = useMemo(() => {
        const maxCount = Math.max(...data.map((value) => value.count), 0);

        return data.map((value, index) => ({
            hour: value.hour,
            count: value.count,
            height: maxCount === 0 ? 16 : Math.max(16, Math.round((value.count / maxCount) * 92)),
            active: value.count === maxCount,
            label: index % 4 === 0 ? value.hour : "",
        }));
    }, [data]);

    return (
        <section className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
            <div className="mb-4 md:mb-5 lg:mb-6 flex items-center justify-between">
                <h3 className="text-[12px] md:text-[13px] lg:text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
                    {t("admin.analytics.peakHours")}
                </h3>
            </div>

            {isError && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error?.message}
                </div>
            )}

            {isLoading && (
                <div className="mb-3 flex items-end gap-1 md:gap-1.5 lg:gap-1.5">
                    {Array.from({ length: 12 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-14 md:h-16 lg:h-16 flex-1 animate-pulse rounded-md bg-gray-200"
                        />
                    ))}
                </div>
            )}

            {!isLoading && (
                <div className="mb-3 flex items-end gap-0.5 md:gap-1 lg:gap-1">
                    {peakHoursData.map((slot) => (
                        <div
                            key={`${slot.hour}-${slot.count}`}
                            className={`flex-1 rounded-md ${slot.active ? "bg-[#f39c33]" : "bg-[#f8c877]"}`}
                            style={{ height: `${slot.height}px` }}
                        />
                    ))}
                </div>
            )}

            {!isLoading && (
                <div className="flex justify-between text-[8px] md:text-[9px] lg:text-[10px] font-semibold text-[#7d7d7d]">
                    {peakHoursData.map((slot, index) => (
                        <span
                            key={`${slot.hour}-${index}`}
                            className={slot.label ? "min-w-6 md:min-w-7 lg:min-w-7" : "min-w-0 md:min-w-1 lg:min-w-1"}
                        >
                            {slot.label}
                        </span>
                    ))}
                </div>
            )}
        </section>
    );
}

export default AnalyticsPeakHoursSection;