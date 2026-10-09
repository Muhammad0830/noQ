import { FC } from "react";
import ServiceCardSkeleton from "./ServiceCardSkeleton";
import Link from "next/link";
import { Route } from "next";
import { Clock3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Service } from "@shared/types/general_types";

interface ServiceListProps {
    isLoading: boolean;
    skeletonCount: number;
    services: Service[]
}

const ServiceList: FC<ServiceListProps> = ({
    isLoading,
    skeletonCount,
    services,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-slate-700">
                {t("user.services.title")}
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-1 shadow-sm">
                {isLoading
                    ? Array.from({ length: skeletonCount }).map((_, i) => (
                        <ServiceCardSkeleton
                            key={`popular-service-skeleton-${i}`}
                        />
                    ))
                    : services.length > 0 ? services.map((item) => {
                        const priceValue =
                            item.price === null || item.price === undefined
                                ? Number.NaN
                                : Number(item.price);
                        const durationValue =
                            item.durationMin === null ||
                                item.durationMin === undefined
                                ? 0
                                : Number(item.durationMin);
                        const targetShopId = item.shopId || item.shop?.id;

                        return (
                            <Link
                                key={item.id}
                                href={
                                    (targetShopId
                                        ? `/book/${targetShopId}?service=${item.id}`
                                        : "/discover") as Route
                                }
                                className="block border-b border-slate-200/70 py-4 last:border-b-0"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-[15px] font-semibold text-slate-900 sm:text-base">
                                            {item.name}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-[10px] tracking-wide text-slate-500">
                                            <Clock3 className="h-4 w-4" />
                                            <span className="truncate">
                                                {Number.isFinite(durationValue)
                                                    ? durationValue
                                                    : 0}{" "}
                                                {t("user.services.duration")} •{" "}
                                                {item.shop?.name ??
                                                    t("user.services.unknownShop")}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="shrink-0 text-right">
                                        <p className="text-[18px] font-bold text-slate-800 sm:text-xl">
                                            {Number.isFinite(priceValue)
                                                ? `${formatPrice(priceValue, locale)} ${t("common.currency")}`
                                                : "--"}
                                        </p>
                                        <span className="mt-1 inline-block text-[10px] font-semibold text-emerald-500">
                                            {t("user.services.book").toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        );
                    }) : <div className="py-5 text-center text-sm text-slate-500">
                        {t("user.services.noResults")}
                    </div>}
            </div>
        </div>
    );
}

export default ServiceList;