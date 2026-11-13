import { FC } from "react";
import { BookingStatus, formatToTimeString, type DashboardBookingItem } from "@noq/shared";
import { cn } from "cn";
import { bookingStatusStyles } from "@/shared/utils/bookings";
import { useTranslations } from "next-intl";

interface DashboardBookingItemProps {
    booking: DashboardBookingItem;
    onOpenDialog: (booking: DashboardBookingItem) => void;
}

const DashboardBookingItem: FC<DashboardBookingItemProps> = ({
    booking,
    onOpenDialog,
}) => {
    const t = useTranslations();

    const getDuration = (startTime: Date, endTime: Date) => {
        const durationMs = endTime.getTime() - startTime.getTime()

        if (Number.isNaN(durationMs) || durationMs <= 0) {
            return "-";
        }

        return Math.round(durationMs / (1000 * 60));
    }

    return (
        <div className="relative z-10 grid grid-cols-[40px_12px_minmax(0,1fr)] items-start gap-1 md:grid-cols-[52px_13px_minmax(0,1fr)] md:gap-1.5 lg:grid-cols-[64px_14px_minmax(0,1fr)] lg:gap-2">
            <div
                className={`pt-1 text-[9px] font-semibold md:pt-1.5 md:text-[10px] lg:pt-2 lg:text-[11px] ${bookingStatusStyles[booking.status].time}`}
            >
                {formatToTimeString(booking.startTime)}
            </div>

            <div className="relative min-h-full min-w-0">
                <span className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-gray-300" />
                <span
                    className={`absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full border-2 bg-white ${bookingStatusStyles[booking.status].dot}`}
                />
            </div>

            <div className="min-w-0 pl-0.5 md:pl-1 lg:pl-1.5">
                <button
                    onClick={() => onOpenDialog(booking)}
                    disabled={
                        booking.status === BookingStatus.CANCELLED ||
                        booking.status === BookingStatus.COMPLETED
                    }
                    className={cn(
                        "w-full rounded-2xl px-3 py-3 shadow-sm md:rounded-2xl md:px-4 md:py-3.5 lg:rounded-3xl lg:px-5 lg:py-4",
                        booking.status === "PENDING" ? "cursor-pointer transition hover:border-orange-300 hover:shadow-md" : "",
                        bookingStatusStyles[booking.status].card,
                    )}
                    style={
                        booking.status === "COMPLETED" ? {
                            backgroundColor: "transparent",
                            borderColor: "#34d399",
                        } : undefined
                    }
                >
                    <div className="mb-0.5 flex min-w-0 items-start justify-between gap-1.5 md:mb-1 md:gap-2 lg:mb-1 lg:gap-3">
                        <p className="text-start truncate min-w-0 flex-1 text-sm font-bold leading-tight text-gray-900 md:text-base lg:text-lg">
                            {booking.customer.name}
                        </p>

                        <span
                            className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[7px] font-bold tracking-widest whitespace-nowrap md:px-2 md:py-0.5 md:text-[8px] lg:px-2.5 lg:py-1 lg:text-[9px]",
                                bookingStatusStyles[booking.status].badge
                            )}
                        >
                            {t(`booking_status.${booking.status}`)}
                        </span>
                    </div>

                    <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400 md:mt-1 md:gap-1.5 md:text-xs lg:mt-1 lg:gap-2 lg:text-xs">
                        <span className="text-start min-w-0 flex-1 truncate">
                            {booking.serviceName}
                        </span>

                        <div className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-semibold text-[#f49b33] whitespace-nowrap md:px-2.5 md:text-[9px] lg:px-2.5 lg:py-1 lg:text-[10px]">
                            <span>{getDuration(new Date(booking.startTime), new Date(booking.endTime))} </span>
                            <span>{t("common.min")}</span>
                        </div>
                    </div>

                    <div className="my-2 h-px bg-gray-300 md:my-2.5 lg:my-3" />

                    <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-gray-400 md:gap-1.5 md:text-xs lg:gap-2 lg:text-xs">
                        <span className="truncate">
                            <span>{t("user.booking.staff")} : </span>
                            <span className="font-semibold text-gray-700">
                                {booking.staff ? booking.staff.name : t("admin.dashboard.staff_not_found")}
                            </span>
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default DashboardBookingItem;