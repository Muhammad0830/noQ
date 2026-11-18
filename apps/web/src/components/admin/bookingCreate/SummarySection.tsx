import { useShop } from "@/contexts/ShopContext";
import { formatPrice } from "@/lib/utils";
import { Service, Staff, UserIdentity } from "@noq/shared";
import { Clock, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

interface DateType {
    date: string;
    time: string | null;
}

interface SummarySectionProps {
    selectedDate: DateType;
    selectedService: Service;
    selectedCustomer: UserIdentity;
    selectedStaff: Staff | null;
    isPending: boolean;
    handleCreate: () => void;
}

const addMinutes = (time: string, minutes: number) => {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + minutes, 0, 0);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const SummarySection: FC<SummarySectionProps> = ({
    selectedDate,
    selectedService,
    selectedCustomer,
    selectedStaff,
    isPending,
    handleCreate,
}) => {
    const t = useTranslations();
    const locale = useLocale();

    const { shop } = useShop()

    const canSubmit = Boolean(
        shop?.id &&
        selectedCustomer &&
        selectedService &&
        selectedStaff &&
        selectedDate &&
        !isPending,
    );

    return (
        <div className="mt-6 mb-4">
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-3">
                <div className="">
                    <div className="flex justify-between text-xs text-slate-600">
                        <span className="uppercase tracking-wide">
                            {t("user.booking.selectedWindow")}
                        </span>

                        <span className="uppercase tracking-wide">
                            {t("user.booking.total")}
                        </span>
                    </div>

                    <div className="flex justify-between items-end mt-1">
                        <p className="font-semibold text-[#F49B33]">
                            {selectedDate.time
                                ? `${selectedDate.time} — ${addMinutes(selectedDate.time, selectedService.durationMin)}`
                                : "--:--"}
                        </p>

                        <p className="text-2xl font-bold text-[#F49B33]">
                            {formatPrice(selectedService.price, locale)} {t("common.currency")}
                        </p>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-700">
                        <UserRound className="h-3.5 w-3.5 text-slate-500" />

                        <span className="truncate">
                            {t("admin.newBooking.selectedCustomer")}:{" "}
                            {selectedCustomer?.name || selectedCustomer?.email || "—"}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-700">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />

                        <div className="truncate space-x-1">
                            <span>{t("user.booking.staff")}:</span>

                            <span>{selectedStaff?.user.name}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    disabled={!canSubmit}
                    className="w-full py-3 rounded-full bg-[#F49B33] text-white font-bold tracking-wide shadow-[0_10px_24px_rgba(244,155,51,0.28)] disabled:opacity-50"
                >
                    {isPending
                        ? t("user.booking.processing")
                        : t("user.booking.confirmBooking")}
                </button>
            </div>
        </div>
    );
}

export default SummarySection;