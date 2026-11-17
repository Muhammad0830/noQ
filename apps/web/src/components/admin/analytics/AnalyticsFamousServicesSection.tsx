import { FamousServiceItem } from "@noq/shared";
import { AxiosError } from "axios";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

interface AnalyticsFamousServicesSectionProps {
    data: FamousServiceItem[]
    isLoading: boolean;
    isError: boolean;
    error: AxiosError | null;
}

const AnalyticsFamousServicesSection: FC<AnalyticsFamousServicesSectionProps> = ({
    data,
    isLoading,
    isError,
    error,
}) => {
    const t = useTranslations();

      const sortedServices = useMemo(() => {
        const maxBookings = Math.max(...data.map((item) => item.bookingCount), 1);
    
        return data.slice(0, 5).map((service) => ({
          ...service,
          width: Math.max(
            6,
            Math.round((service.bookingCount / maxBookings) * 100),
          ),
        }));
      }, [data]);

    return (
        <section className="rounded-4xl bg-white p-4 md:p-5 lg:p-6 shadow-[0_10px_30px_rgba(15,17,21,0.06)]">
            <h3 className="mb-4 md:mb-5 lg:mb-6 text-[12px] md:text-[13px] lg:text-[13px] font-bold uppercase tracking-[0.28em] text-[#111111]">
                {t("admin.analytics.mostPopularServices")}
            </h3>

            {isError && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error?.message}
                </div>
            )}

            {isLoading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index}>
                            <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-200" />
                            <div className="h-1.5 animate-pulse rounded-full bg-gray-100" />
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && sortedServices.length > 0 && (
                <div className="space-y-4">
                    {sortedServices.map((service) => (
                        <div key={service.id}>
                            <div className="mb-2 flex items-center justify-between gap-3 text-[11px] md:text-[12px] lg:text-[12px]">
                                <div className="font-medium text-[#1a1a1a]">
                                    {service.name}
                                </div>
                                <div className="text-[#8f8f8f]">
                                    {t("admin.analytics.servicesBookings", {
                                        count: service.bookingCount,
                                    })}
                                </div>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-[#f1e3d0]">
                                <div
                                    className="h-full rounded-full bg-[#f4a341]"
                                    style={{ width: `${service.width}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!isLoading && !sortedServices.length && (
                <div className="text-sm text-gray-500">
                    {t("admin.analytics.noServicesForPeriod")}
                </div>
            )}
        </section>
    );
}

export default AnalyticsFamousServicesSection;