import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useShop } from "@/contexts/ShopContext";
import useApiQuery from "@/hooks/useApiQuery";
import { API_ENDPOINTS } from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";
import { Service } from "@noq/shared";
import { useLocale, useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useState } from "react";

interface SelectServiceProps {
    selectedService: Service | null,
    onSelect: Dispatch<SetStateAction<Service | null>>;
}

const SelectService: FC<SelectServiceProps> = ({
    selectedService,
    onSelect,
}) => {
    const t = useTranslations();
    const locale = useLocale()
    const { shop } = useShop();

    const [open, setOpen] = useState(false);

    const { data: services = [], isLoading: servicesLoading } = useApiQuery<
        Service[]
    >(API_ENDPOINTS.admin.active_services, {
        key: ["admin-new-booking-services", `${shop?.id}`],
        enabled: !!shop?.id,
        staleTime: 30_000,
        headers: { "x-shop-id": shop?.id ?? '' },
    });

    const handleSelect = (service: Service) => {
        onSelect(service)
        setOpen(false);
    }

    return (
        <section className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">
                1. {t("user.booking.service")}
            </h3>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <button
                        className={cn(
                            "w-full flex flex-col items-start rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 cursor-pointer shadow-sm",
                            selectedService && "border-primary/30 bg-primary/5"
                        )}
                    >
                        {selectedService ? (
                            <>
                                <p className="block truncate text-sm font-semibold text-gray-800">
                                    {selectedService.name}
                                </p>

                                <div className="flex gap-1 mt-1 truncate text-xs text-gray-500">
                                    <span>
                                        {formatPrice(selectedService.price, locale)} {t("common.currency")} ·
                                    </span>

                                    <span>
                                        {selectedService.durationMin} {t("admin.services.duration")}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="block truncate text-sm font-semibold text-gray-800">
                                    {t("admin.newBooking.selectService")}
                                </span>

                                <span className="block truncate text-xs mt-1 text-gray-500">
                                    {t("admin.newBooking.selectByPressing")}
                                </span>
                            </>
                        )}
                    </button>
                </DialogTrigger>

                <DialogContent className="max-h-[80vh] flex flex-col">
                    <DialogTitle>
                        {t("admin.newBooking.selectService")}
                    </DialogTitle>

                    <div className="flex-1 space-y-2 overflow-y-auto">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleSelect(service)}
                                className={`w-full text-left rounded-xl p-3 border ${selectedService?.id === service.id
                                    ? "border-[#F49B33] bg-orange-50 shadow-sm"
                                    : "border-slate-200 bg-white"
                                    }`}
                            >
                                <p className="text-sm font-medium text-slate-900">
                                    {service.name}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {formatPrice(service.price ?? 0, locale || "uz-UZ")}{" "}
                                    {t("common.currency")} · {service.durationMin ?? 45}{" "}
                                    {t("admin.services.duration")}
                                </p>
                            </button>
                        ))}

                        {!servicesLoading && services.length === 0 && (
                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {t("admin.newBooking.noServices")}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    );
}

export default SelectService;