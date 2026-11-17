
"use client";

import { IntervalEnum, IntervalType } from "@noq/shared";
import { cn, formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useId, useMemo } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { format } from "date-fns";
import { AxiosError } from "axios";

interface AnalyticsRevenueChartProps {
    points: { date: string; revenue: number }[];
    isLoading: boolean;
    interval: IntervalType;
    setInterval: Dispatch<SetStateAction<IntervalType>>;
    canSelectMonth: boolean;
    canSelectYear: boolean;
    isError: boolean;
    error: AxiosError | null;
}

const AnalyticsRevenueChart: FC<AnalyticsRevenueChartProps> = ({
    points,
    isLoading,
    interval,
    setInterval,
    canSelectMonth,
    canSelectYear,
    isError,
    error,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    const gradientId = useId().replace(/:/g, "");

    const chartConfig = {
        revenue: {
            label: t("admin.analytics.revenue"),
            color: "#f39c33",
        },
    } satisfies ChartConfig;

    const chartData = useMemo(() => {
        if (!points.length) {
            return [{ date: new Date().toISOString(), revenue: 0 }];
        }

        return points;
    }, [points]);

    const formatDate = (value: string, full = false) => {
        const date = /^\d{4}-\d{2}$/.test(value)
            ? new Date(`${value}-01T00:00:00`)
            : /^\d{4}-\d{2}-\d{2}$/.test(value)
                ? new Date(`${value}T00:00:00`)
                : new Date(value);

        if (Number.isNaN(date.getTime())) {
            return t("admin.analytics.invalidDateLabel");
        }

        switch (interval) {
            case "day":
                return new Intl.DateTimeFormat(locale, {
                    day: "2-digit",
                    month: full ? "long" : "2-digit",
                    year: full ? "numeric" : undefined,
                }).format(date);

            case "month":
                return t(`months.${format(date, "MMMM").toLowerCase()}`);

            case "year":
                return new Intl.DateTimeFormat(locale, {
                    year: "numeric",
                }).format(date);

            default:
                return new Intl.DateTimeFormat(locale).format(date);
        }
    };

    const formatCompactRevenue = (value: number) => {
        return new Intl.NumberFormat(locale, {
            notation: "compact",
            maximumFractionDigits: 1,
        }).format(value);
    };

    const activeRevenue = chartData[chartData.length - 1]?.revenue ?? 0;

    if (isLoading) {
        return (
            <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
                <div className="mb-4 h-4 w-40 animate-pulse rounded bg-gray-200" />
                <div className="h-52 animate-pulse rounded-3xl bg-gray-100" />
            </div>
        );
    }

    return (
        <div className="rounded-[24px] bg-white p-4 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[#111111]">
                <span className="h-2 w-2 rounded-full bg-[#f39c33]" />
                {t("admin.analytics.dailyRevenueTrends")}
            </div>

            {isError && (
                <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error?.message}
                </div>
            )}

            <div className="rounded-4xl bg-linear-to-br from-[#faf1e5] to-[#fffdf8] px-2 py-4">
                <ChartContainer
                    config={chartConfig}
                    className="h-52.5 w-full"
                >
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            top: 12,
                            right: 12,
                            bottom: 0,
                            left: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id={gradientId}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#f39c33"
                                    stopOpacity={0.35}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#f39c33"
                                    stopOpacity={0.02}
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            vertical={false}
                            stroke="#eadfce"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={20}
                            tickFormatter={(value) => formatDate(value)}
                            tick={{ fontSize: 10, fill: "#8b8b8b" }}
                        />

                        <YAxis
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={4}
                            width={48}
                            domain={[0, "auto"]}
                            tickFormatter={formatCompactRevenue}
                            tick={{ fontSize: 10, fill: "#8b8b8b" }}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) =>
                                        formatDate(String(value), true)}
                                    formatter={(value) => (
                                        <span className="font-semibold text-[#f39c33]">
                                            {formatPrice(Number(value), locale)}
                                        </span>
                                    )}
                                />
                            }
                        />

                        <Area
                            dataKey="revenue"
                            type="monotone"
                            stroke="#f39c33"
                            strokeWidth={3}
                            fill={`url(#${gradientId})`}
                            fillOpacity={1}
                            activeDot={{
                                r: 5,
                                fill: "#f39c33",
                                stroke: "#fff",
                                strokeWidth: 3,
                            }}
                        />
                    </AreaChart>
                </ChartContainer>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
                <div className="mt-1 text-right text-[10px] font-semibold text-[#8b8b8b]">
                    {t("admin.analytics.latestRevenue")}:{" "}
                    <span className="text-[#f39c33]">
                        {formatPrice(activeRevenue, locale)}
                    </span>
                </div>

                <div className="flex overflow-hidden rounded-sm border border-primary">
                    {Object.entries(IntervalEnum).map(([label, value]) => {
                        const disabled =
                            (value === "month" && !canSelectMonth) ||
                            (value === "year" && !canSelectYear);

                        return (
                            <button
                                key={value}
                                type="button"
                                disabled={disabled}
                                onClick={() => setInterval(value)}
                                className={cn(
                                    "px-3 py-1 text-xs font-semibold uppercase text-primary transition-all duration-150",
                                    interval === value &&
                                    "bg-primary text-white",
                                    disabled &&
                                    "cursor-not-allowed opacity-30",
                                )}
                            >
                                {t(`admin.analytics.${label}`)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsRevenueChart;
