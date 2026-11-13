import { formatPrice } from "@/lib/utils";
import { BasicService } from "@noq/shared";
import { cn } from "cn";
import { Clock3, Loader2, PenLine, Scissors } from "lucide-react";
import { Route } from "next";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

interface ActiveServiceCardProps {
    service: BasicService;
    isUpdating: (id: string) => boolean;
    deactivateService: (id: string) => void;
}

const ActiveServiceCard: FC<ActiveServiceCardProps> = ({
    service,
    isUpdating,
    deactivateService,
}) => {
    const t = useTranslations();
    const pending = isUpdating(service.id);

    return (
        <article
            key={service.id}
            className={cn(
                "relative overflow-hidden rounded-4xl bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5 transition-transform duration-200 hover:-translate-y-0.5",
                pending && "opacity-80"
            )}
        >
            {pending && (
                <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-white/65 backdrop-blur-[1px]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#F49B33]" />

                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7f8894]">
                        {t("admin.services.updating")}
                    </span>
                </div>
            )}

            <div className="min-w-0">
                <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-3">
                    <div>
                        <h3 className="text-[16px] md:text-[17px] lg:text-[18px] font-bold tracking-tight text-[#111827]">
                            {service.name}
                        </h3>

                        <div className="mt-1 flex items-center gap-2 text-[11px] md:text-[12px] lg:text-[12px] text-[#8b95a1]">
                            <Clock3 className="h-3 w-3 md:h-3.5 md:w-3.5 lg:h-3.5 lg:w-3.5" />

                            <span>
                                {service.durationMin} {t("admin.services.duration")}
                            </span>

                            <span className="text-[#d8dbe1]">•</span>

                            <span>
                                {formatPrice(service.price)} {t("user.services.price")}
                            </span>
                        </div>
                    </div>

                    <div className="inline-flex min-h-9 md:min-h-13 lg:min-h-9 min-w-12 md:min-w-13 lg:min-w-14 items-center justify-center rounded-3xl md:rounded-3xl lg:rounded-3xl bg-[#fff2e4] px-2 md:px-3 lg:px-3 py-1.5 md:py-2 lg:py-2">
                        <p className="text-md md:text-2xl lg:text-md font-bold leading-none tracking-tight text-[#F49B33]">
                            {formatPrice(service.price)} {t("user.services.price")}
                        </p>
                    </div>
                </div>

                <div className="mt-3 md:mt-4 lg:mt-4 flex items-center justify-between gap-2 md:gap-3 lg:gap-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-7 md:h-8 lg:h-8 w-7 md:w-8 lg:w-8 items-center justify-center rounded-full bg-[#fff2e4] text-[#F49B33]">
                            <Scissors className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4" />
                        </span>

                        <span className="text-[9px] md:text-[10px] lg:text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7f8894]">
                            {service.bufferTime
                                ? t("admin.services.buffer", {
                                    minutes: service.bufferTime,
                                })
                                : t("admin.services.noBuffer")}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-2 lg:gap-2">
                        <Link
                            href={`/admin/services/edit/${service.id}` as Route}
                            aria-label={t("admin.services.aria.editService")}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8f98a4] transition-colors hover:bg-[#f3f4f6]"
                        >
                            <PenLine className="h-4 w-4" />
                        </Link>

                        <button
                            type="button"
                            onClick={() => deactivateService(service.id)}
                            disabled={isUpdating(service.id)}
                            className={cn(
                                "relative h-7 w-12 rounded-full transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22c55e]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                                service.isActive ? "bg-[#22c55e]" : "bg-[#d7dbe3]",
                            )}
                            aria-label={t("admin.services.aria.toggleService")}
                            aria-pressed={service.isActive}
                        >
                            <span
                                className={cn(
                                    "absolute top-0.75 h-5 w-5 rounded-full transition-all duration-200",
                                    service.isActive ? "left-6 bg-white" : "left-1 bg-white",
                                )}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default ActiveServiceCard;