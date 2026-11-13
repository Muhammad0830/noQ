import { useTranslations } from "next-intl";
import { FC } from "react";
import InactiveServiceCard from "./InactiveServiceCard";
import { BasicService } from "@noq/shared";
import ServiceListSkeleton from "./ServiceListSkeleton";

interface InactiveServiceListProps {
    services: BasicService[];
    isLoading: boolean;
    isUpdating: (id: string) => boolean;
    activateService: (id: string) => void;
}

const InactiveServiceList: FC<InactiveServiceListProps> = ({
    services,
    isLoading,
    isUpdating,
    activateService,
}) => {
    const t = useTranslations();

    return (
        <section className="mt-6 md:mt-7 lg:mt-8">
            <h3 className="mt-1 text-[15px] md:text-[16px] lg:text-[17px] font-medium text-[#8b95a1]">
                {t("admin.services.inactive")}
            </h3>

            <div className="mt-4 md:mt-4 lg:mt-5 space-y-2 md:space-y-3 lg:space-y-3 rounded-4xl bg-white p-3 md:p-4 lg:p-5 shadow-[0_10px_25px_rgba(17,24,39,0.04)] ring-1 ring-black/5">
                {isLoading && (
                    <ServiceListSkeleton count={5} />
                )}

                {services.length === 0 && !isLoading && (
                    <div className="rounded-xl border border-dashed border-[#d5d9df] px-4 py-6 text-center text-sm text-[#8b95a1]">
                        {t("admin.services.noInactive")}
                    </div>
                )}

                {services.map((service) => (
                    <InactiveServiceCard
                        key={service.id}
                        service={service}
                        activateService={activateService}
                        isUpdating={isUpdating}
                    />
                ))}
            </div>
        </section>
    );
}

export default InactiveServiceList;