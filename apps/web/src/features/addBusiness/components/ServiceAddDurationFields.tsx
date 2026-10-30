import { FC } from "react";
import FieldCard from "./FieldCard";
import { Clock3 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FieldError } from "react-hook-form";

interface ServiceAddDurationFieldsProps {
    error: FieldError | undefined;
    durationMin: string,
    bufferTime: number,
    handleDrawerOpen: (field: 'durationMin' | 'bufferTime') => void;
}

const ServiceAddDurationFields: FC<ServiceAddDurationFieldsProps> = ({
    error,
    durationMin,
    bufferTime,
    handleDrawerOpen,
}) => {
    const t = useTranslations();

    return (
        <FieldCard
            icon={<Clock3 className="h-4 w-4 text-[#F49B33]" />}
            label={t("newShop.step3.serviceDuration")}
            error={error}
        >
            <div className="flex items-center gap-2">
                <div className="flex-1">
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                        {t("newShop.step3.duration")}
                    </label>

                    <button
                        type="button"
                        onClick={() => handleDrawerOpen('durationMin')}
                        className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[#111827] text-start"
                    >
                        {durationMin === "00:00" ? '--:--' : durationMin}
                    </button>
                </div>

                <div className="flex-1">
                    <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#6b7280]">
                        {t("newShop.step3.bufferTime")}
                    </label>

                    <button
                        type="button"
                        onClick={() => handleDrawerOpen('bufferTime')}
                        className="h-12 w-full rounded-2xl border border-[#cfd5dd] bg-white px-4 text-[#111827] text-start"
                    >
                        {bufferTime}
                    </button>
                </div>
            </div>
        </FieldCard>
    );
}

export default ServiceAddDurationFields;