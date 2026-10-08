import { FC } from "react";
import { InProgressBookingCardData } from "../types";
import { Link, Navigation, Scissors, XCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";

interface InProgressBookingCardProps {
    booking: InProgressBookingCardData,
    isCancelling: boolean | undefined,
    onCancel: (bookingId: string) => void,
}

const InProgressBookingCard: FC<InProgressBookingCardProps> = ({
    booking,
    isCancelling,
    onCancel
}) => {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div key={booking.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#f8fcff_0%,#eef4fa_100%)] shadow-[0_18px_40px_rgba(56,88,120,0.2)]">
            <div className="relative h-36 overflow-hidden border-b border-slate-200 bg-[linear-gradient(130deg,#cad7e2_0%,#9eb0bf_35%,#738b9d_100%)] sm:h-44">
                {booking.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={booking.image}
                        alt={booking.shopName}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                )}
            </div>

            <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-[#F49B33]">
                            {booking.serviceName}
                        </p>
                        <h3 className="mt-1 text-[32px] font-semibold leading-none tracking-tight text-slate-900 sm:text-[40px]">
                            {booking.shopName}
                        </h3>
                        <p className="mt-2 text-sm text-slate-700 sm:text-base">
                            {booking.address}
                        </p>
                    </div>
                    <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#F49B33]/55 bg-[#F49B33] text-white shadow-[0_8px_18px_rgba(244,155,51,0.32)] transition hover:bg-[#e28a20]">
                        <Scissors className="h-5 w-5" />
                    </button>
                </div>

                <div className="my-4 h-px w-full bg-linear-to-r from-slate-200/0 via-slate-400/40 to-slate-200/0" />

                <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        {booking.remainingDays !== null ? (
                            <div className="flex h-14 w-20 flex-col items-center justify-center rounded-2xl bg-[#F49B33] text-white shadow-[0_8px_22px_rgba(244,155,51,0.34)]">
                                <span className="text-[22px] font-semibold leading-none">
                                    {booking.remainingDays}
                                </span>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.09em]">
                                    {t("user.history.time.days")}
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[#F49B33] text-white shadow-[0_8px_22px_rgba(244,155,51,0.34)]">
                                    <span className="text-[22px] font-semibold leading-none">
                                        {booking.remainingHours}
                                    </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.09em]">
                                        {t("user.history.time.hour")}
                                    </span>
                                </div>
                                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-slate-300 bg-white text-slate-900">
                                    <span className="text-[22px] font-semibold leading-none">
                                        {booking.remainingMinutes}
                                    </span>
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.09em] text-slate-500">
                                        {t("user.history.time.min")}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="text-[11px] uppercase tracking-[0.11em] text-slate-500">
                            {t("user.history.startsAt")}
                        </p>
                        <p className="text-[20px] font-semibold tracking-tight text-slate-900 sm:text-[30px]">
                            {booking.startLabel}
                        </p>
                    </div>
                </div>

                <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-300/70 bg-white/75 px-3 py-2">
                    <p className="text-xs uppercase tracking-widest text-slate-500">
                        {t("user.history.serviceDetails")}
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                        {booking.duration} • {formatPrice(booking.price, locale)} {t("common.currency")}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/bookings/directions`}
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#F49B33] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(244,155,51,0.35)] transition hover:bg-[#e28a20]"
                    >
                        <Navigation className="h-4 w-4" />
                        {t("user.history.getDirections")}
                    </Link>
                    <button
                        type="button"
                        onClick={() => onCancel(booking.id)}
                        disabled={isCancelling}
                        className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Cancel booking"
                    >
                        <XCircle
                            className={`h-5 w-5 ${isCancelling ? "animate-pulse" : ""}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InProgressBookingCard;