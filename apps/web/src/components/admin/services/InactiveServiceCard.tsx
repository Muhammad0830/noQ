"use client";

import { cn, formatPrice } from "@/lib/utils";
import { BasicService } from "@noq/shared";
import { Loader2, PenLine, Scissors } from "lucide-react";
import { Route } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

interface InactiveServiceCardProps {
    service: BasicService;
    isUpdating: (id: string) => boolean;
    activateService: (id: string) => void;
}

const InactiveServiceCard: FC<InactiveServiceCardProps> = ({
    service,
    isUpdating,
    activateService
}) => {
    const t = useTranslations();

    return (
        <div
            key={service.id}
            className={cn(
                "relative flex items-center gap-2 md:gap-3 lg:gap-3 rounded-2xl md:rounded-2xl lg:rounded-2xl py-0.5 md:py-1 lg:py-1",
                isUpdating(service.id) ? "opacity-80" : ""
            )}
        >
            {isUpdating(service.id) && (
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 rounded-2xl bg-white/65 backdrop-blur-[1px]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                        {t("admin.services.updating")}
                    </span>
                </div>
            )}

            <div className="flex h-9 md:h-10 lg:h-10 w-9 md:w-10 lg:w-10 items-center justify-center rounded-2xl md:rounded-2xl lg:rounded-2xl bg-[#f3f4f6] text-[#a4abb6]">
                <Scissors className="h-4 w-4 md:h-5 md:w-5 lg:h-5 lg:w-5" />
            </div>

            <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] md:text-[16px] lg:text-[16px] font-semibold text-[#374151]">
                    {service.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] md:text-[11px] lg:text-[11px] text-[#98a0ab]">
                    <span>
                        {service.durationMin} {t("admin.services.duration")}
                    </span>
                    <span className="text-[#d8dbe1]">•</span>

                    <span>
                        {formatPrice(`${service.price}`)} {t("user.services.price")}
                    </span>
                </div>

                <Link
                    href={`/admin/services/edit/${service.id}` as Route}
                    className="mt-1 inline-flex items-center gap-1 text-[9px] md:text-[10px] lg:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9aa1ab] transition-colors hover:text-[#F49B33]"
                >
                    <PenLine className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-3.5 lg:w-3.5" />

                    <span>{t("admin.services.edit.edit")}</span>
                </Link>
            </div>

            <button
                type="button"
                onClick={() => activateService(service.id)}
                disabled={isUpdating(service.id)}
                className={cn(
                    "relative h-7 w-12 rounded-full transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                    service.isActive ? "bg-[#22c55e]" : "bg-[#d7dbe3]"
                )}
                aria-label={t("admin.services.aria.toggleService")}
                aria-pressed={service.isActive}
            >
                <span
                    className={cn(
                        "absolute top-0.75 h-5 w-5 rounded-full transition-all duration-200",
                        service.isActive ? "left-6 bg-white" : "left-1 bg-white"
                    )}
                />
            </button>
        </div>
    );
}

export default InactiveServiceCard;