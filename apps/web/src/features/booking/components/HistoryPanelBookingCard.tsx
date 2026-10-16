import { formatPrice } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { FC, ReactNode } from "react";
import { HistoryCardData } from "../types";
import Link from "next/link";

interface HistoryPanelBookingCardProps {
    booking: HistoryCardData;
    getShopInitial: (shopName: string) => ReactNode;
}

const HistoryPanelBookingCard: FC<HistoryPanelBookingCardProps> = ({
    booking,
    getShopInitial,
}) => {
    const t = useTranslations();
    const locale = useLocale()

    return (
        <div
            key={booking.id}
            className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-[linear-gradient(145deg,rgba(255,255,255,0.95),rgba(241,246,253,0.92))] shadow-[0_10px_20px_rgba(63,99,132,0.16)]"
        >
            {/* Header Section */}
            <div className="p-3.5 pb-3">
                <div className="flex items-start gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                        {booking.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={booking.image}
                                alt={booking.shopName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-700">
                                {getShopInitial(booking.shopName)}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-[18px] font-semibold tracking-tight text-slate-900">
                            {booking.shopName}
                        </h3>
                        <p className="text-sm text-slate-600">{booking.serviceName}</p>
                        <p className="truncate text-xs text-slate-500">
                            {booking.address}
                        </p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-3.5 h-px bg-slate-200" />

            {/* Status Section */}
            <div className="flex items-center justify-between px-3.5 py-3 pr-4">
                <div className="text-xs text-slate-500">
                    <span className="font-semibold">
                        {booking.date} • {booking.time}
                    </span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                    {booking.duration} • {formatPrice(booking.price, locale)} {t("common.currency")}
                </div>
            </div>

            {booking.status === "COMPLETED" && (
                <div className="border-t border-slate-200 px-3.5 py-3">
                    <div className="flex gap-2">
                        <button className="h-9 flex-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-xs font-semibold text-white transition hover:bg-emerald-500/20">
                            {t("user.history.rateService")}
                        </button>
                        <Link
                            href={`/book/${booking.id}`}
                            className="flex h-9 flex-1 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            {t("user.history.rebook")}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HistoryPanelBookingCard;