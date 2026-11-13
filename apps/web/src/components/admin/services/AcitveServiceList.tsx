import { BasicService } from "@noq/shared";
import { useTranslations } from "next-intl";
import { FC } from "react";
import ServiceListSkeleton from "./ServiceListSkeleton";
import ActiveServiceCard from "./ActiveServiceCard";

interface ActiveServiceListProps {
    services: BasicService[],
    isLoading: boolean;
    isUpdating: (id: string) => boolean;
    deactivateService: (id: string) => void;
}

const ActiveServiceList: FC<ActiveServiceListProps> = ({
    services,
    isLoading,
    isUpdating,
    deactivateService,
}) => {
    const t = useTranslations();

    return (
        <section className="mt-4 md:mt-4 lg:mt-5 space-y-3 md:space-y-4 lg:space-y-4">
            {isLoading && <ServiceListSkeleton count={5} />}

            {services.length === 0 && !isLoading && (
                <div className="rounded-[24px] border border-dashed border-[#d5d9df] bg-white px-4 py-8 text-center text-sm text-[#8b95a1]">
                    {t("admin.services.noActiveMatches")}
                </div>
            )}

            {services.map((service) => (
                <ActiveServiceCard
                    key={service.id}
                    service={service}
                    isUpdating={isUpdating}
                    deactivateService={deactivateService}
                />
            ))}
        </section>
    )
}

export default ActiveServiceList;