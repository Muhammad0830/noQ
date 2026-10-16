import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";
import { SelectedDateType } from "../types";
import { Service } from "@noq/shared";

interface BookingFooterProps {
    selectedDate: SelectedDateType;
    bookingEndTime: string | null;
    selectedService: Service | undefined;
    disabled: boolean;
    isPending: boolean;
    onConfirm: () => Promise<void>;
}

const BookingFooter: FC<BookingFooterProps> = ({
    selectedDate,
    bookingEndTime,
    selectedService,
    disabled,
    isPending,
    onConfirm,
}) => {
    const t = useTranslations();
    const locale = useLocale()

    return (
        <div className="mb-4">
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-[#f1c894]">
                <div className="rounded-2xl border border-[#f1c894]/70 bg-white p-3 mb-3">
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
                            {selectedDate.time && bookingEndTime
                                ? `${selectedDate.time} — ${bookingEndTime}`
                                : "--:--"}
                        </p>

                        <p className="text-2xl font-bold text-[#F49B33] dark:text-[#F49B33]">
                            {formatPrice(selectedService?.price, locale)} {t("common.currency")}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onConfirm}
                    disabled={disabled}
                    className="w-full py-3 rounded-full bg-[#F49B33] text-white font-bold tracking-wide disabled:opacity-50"
                >
                    {isPending ? t("user.booking.processing") : t("user.booking.confirmBooking")}
                </button>
            </div>
        </div>
    );
}

export default BookingFooter;