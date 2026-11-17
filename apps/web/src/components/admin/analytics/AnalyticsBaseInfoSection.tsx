import { cn, formatPrice } from "@/lib/utils";
import { AnalyticsSummaryResponse } from "@noq/shared";
import { AxiosError } from "axios";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";
import MetricCard from "./MetricCard";
import { CalendarDays, Star } from "lucide-react";

interface AnalyticsBaseInfoSectionProps {
    data: AnalyticsSummaryResponse;
    isLoading: boolean;
    isError: boolean;
    error: AxiosError | null;
}

const AnalyticsBaseInfoSection: FC<AnalyticsBaseInfoSectionProps> = ({
    data,
    isLoading,
    isError,
    error,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    const bookingCountChangeText = `${data.lastWeekBookingCountChange >= 0 ? "+" : ''}${data.lastWeekBookingCountChange.toFixed(1)}%`
    const ratingChangeText = `${data.lastWeekAverageRatingChange >= 0 ? "+" : ''}${data.lastWeekAverageRatingChange.toFixed(1)}`;

    return (
        <>
            {isError && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error?.message}
                </div>
            )}

            <div className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
                <div className="mb-2 md:mb-3 lg:mb-4 flex items-center justify-between">
                    <p className="text-[9px] md:text-[10px] lg:text-[10px] font-bold uppercase tracking-[0.28em] text-[#bdbdbd]">
                        {t("admin.analytics.totalRevenue")}
                    </p>

                    {isLoading ? (
                        <span className="h-6 w-14 md:w-16 lg:w-16 animate-pulse rounded-full bg-gray-200" />
                    ) : (
                        <span
                            className={cn(
                                "rounded-full px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-semibold bg-red-50 text-red-600",
                                data.lastWeekRevenueChange >= 0 && "bg-green-50 text-green-600"
                            )}
                        >
                            {data.lastWeekRevenueChange >= 0 && "+"}
                            {data.lastWeekRevenueChange.toFixed(1)}%
                        </span>
                    )}
                </div>

                <div className="flex items-end gap-2">
                    {isLoading ? (
                        <div className="h-10 md:h-11 lg:h-11 w-40 md:w-44 lg:w-44 animate-pulse rounded-2xl bg-gray-200" />
                    ) : (
                        <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold leading-none tracking-tight text-[#111111] line-clamp-2">
                            {formatPrice(data.revenue, locale)}
                        </h2>
                    )}

                    <span className="pb-1 text-[11px] md:text-[12px] lg:text-[12px] font-semibold text-[#9a9a9a]">
                        {t("admin.analytics.currency")}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-3.5 lg:gap-4">
                <MetricCard
                    icon={<CalendarDays className="h-4 w-4" />}
                    label={t("admin.analytics.bookingsCount")}
                    value={`${data.bookingCount}`}
                    change={bookingCountChangeText}
                    isLoading={isLoading}
                    changeClassName={data.lastWeekBookingCountChange >= 0
                        ? "bg-green-50 text-green-500" : "bg-red-50 text-red-600"
                    }
                />

                <MetricCard
                    icon={<Star className="h-4 w-4 fill-[#f39c33] text-[#f39c33]" />}
                    label={t("admin.analytics.rating")}
                    value={data.averageRating.toFixed(1)}
                    change={ratingChangeText}
                    isLoading={isLoading}
                    changeClassName={data.lastWeekAverageRatingChange >= 0
                        ? "bg-green-50 text-green-500" : "bg-red-50 text-red-600"
                    }
                />
            </div>
        </>
    );
}

export default AnalyticsBaseInfoSection;