import { formatPrice } from "@/lib/utils";
import { Service } from "@noq/shared";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

interface SelectedServiceCardProps {
    service: Service;
}

const SelectedServiceCard: FC<SelectedServiceCardProps> = ({
    service,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div
            className="rounded-2xl border border-[#f1c894] bg-white p-4 mb-6 cursor-pointer"
        >
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <p className="text-base font-semibold text-slate-900">
                        {service.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                        <span className="text-[#F49B33] dark:text-[#F49B33] font-bold">
                            {formatPrice(service.price ?? 0, locale)} {t("common.currency")}
                        </span>
                        <span className="text-[#d3b089]">·</span>
                        <span className="text-slate-500">
                            {service?.durationMin} {t("user.services.duration")}
                        </span>
                    </div>
                </div>

                <div className="text-xs font-semibold rounded-full px-4 py-2 border border-[white] bg-[#fff3e6] text-[#F49B33]">
                    {t("user.booking.edit")}
                </div>
            </div>
        </div>
    );
}

export default SelectedServiceCard;