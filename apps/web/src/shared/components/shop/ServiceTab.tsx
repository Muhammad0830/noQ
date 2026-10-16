import { formatPrice } from "@/lib/utils";
import { Service } from "@/shared/types/service";
import { Clock } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { FC } from "react";

interface ServiceTabProps {
    serviceList: Service[];
    shopId: string;
}

const ServiceTab: FC<ServiceTabProps> = ({
    serviceList,
    shopId,
}) => {
    const t = useTranslations()
    const locale = useLocale()

    return (
        <div className="space-y-4">
            {serviceList.length > 0 ? (
                serviceList.map((service) => (
                    <Link
                        key={service.id}
                        href={`/book/${shopId}?service=${service.id}`}
                        className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                    >
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900">
                                {service.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                                {service.durationMin && (
                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                        <Clock className="w-4 h-4 shrink-0" />
                                        <span>
                                            {service.durationMin} {t("user.services.duration")}
                                        </span>
                                    </span>
                                )}
                                {service.description && (
                                    <span className="truncate">{service.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 ml-4 shrink-0">
                            <div className="text-right">
                                <p
                                    className="text-base sm:text-lg font-bold text-teal-600"
                                    style={{ overflowWrap: "anywhere" }}
                                >
                                    {formatPrice(service.price || 0, locale)} {t("common.currency")}
                                </p>
                            </div>
                            <button className="px-4 sm:px-6 py-2 bg-teal-500 text-white text-xs sm:text-sm font-medium rounded-full hover:bg-teal-600 transition whitespace-nowrap text-center">
                                {t("user.services.book")}
                            </button>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-gray-500 text-center py-8">
                    {t("user.shop.noServices")}
                </p>
            )}
        </div>
    );
}

export default ServiceTab;