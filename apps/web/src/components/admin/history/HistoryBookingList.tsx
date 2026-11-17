import { useTranslations } from "next-intl";
import { FC } from "react";
import HistoryBookingsSkeleton from "./HistoryBookingsSekeleton";
import { AdminHistoryBooking, formatToDateString } from "@noq/shared";
import { UserRound } from "lucide-react";
import { AxiosError } from "axios";
import { statusLabels } from "@/features/booking/utils";

interface HistoryBookingListProps {
    bookings: AdminHistoryBooking[]
    isLoading: boolean;
    isError: boolean;
    error: AxiosError | null
}

const HistoryBookingList: FC<HistoryBookingListProps> = ({
    bookings,
    isLoading,
    isError,
    error
}) => {
    const t = useTranslations();

    const badgeClasses = {
        PENDING: "bg-[#f8ece0] text-[#e5a65f]",
        CONFIRMED: "bg-[#f8ece0] text-[#e5a65f]",
        IN_PROGRESS: "bg-[#f8ece0] text-[#e5a65f]",
        COMPLETED: "bg-[#d4f8d4] text-[#2aa85d]",
        CANCELLED: "bg-[#f2dddd] text-[#d09898]",
        NO_SHOW: "bg-[#f2dddd] text-[#d09898]",
    }

    return (
        <section className="flex min-h-0 flex-1 flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#8f949a]">
                    {t("admin.history.dailyBookings")}
                </h2>
                <span className="rounded-md border border-[#c8ccd1] px-2 md:px-2.5 lg:px-2.5 py-0.5 md:py-1 lg:py-1 text-[9px] md:text-[10px] lg:text-[10px] font-medium text-[#9ba0a6]">
                    {t("admin.history.recordsCount")}: {bookings.length}
                </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                {isLoading && <HistoryBookingsSkeleton />}

                {isError && !isLoading && (
                    <div className="rounded-2xl border border-[#f2dddd] bg-[#fff7f7] px-4 py-6 text-center text-sm text-[#c56b6b]">
                        {error?.message ||
                            t("admin.history.loadingError")}
                    </div>
                )}

                {!isLoading && !isError && (
                    <div className="divide-y divide-[#d7d9dd] border-y border-[#d7d9dd]">
                        {bookings.map((item) => (
                            <article
                                key={item.id}
                                className="flex items-start gap-3 py-3"
                            >
                                <div
                                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${badgeClasses[item.status]}`}
                                >
                                    <UserRound className="h-3.5 w-3.5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-[17px] font-semibold leading-tight tracking-tight text-[#0f172a]">
                                        {item.customer.name}
                                    </p>

                                    <p className="truncate text-[12px] font-medium leading-tight">
                                        <span className="text-[#f0a339]">{formatToDateString(item.startTime)}</span>
                                        <span className="mx-2 text-[#b7bcc2]">•</span>
                                        <span className="text-[#8f949a]">
                                            {item.serviceName}
                                        </span>
                                    </p>

                                    <p className="truncate text-[9px] uppercase tracking-[0.18em] text-[#b7bcc2]">
                                        {item.staff
                                            ? `${t("admin.history.staffColumn")}: ${item.staff?.user.name}`
                                            : t("admin.history.staff_notFound")}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[22px] font-semibold leading-none tracking-tight text-[#f0932b]">
                                        {item.servicePrice} {t("common.sum")}
                                    </p>

                                    <div className="flex items-center justify-end gap-2 pt-2">
                                        <span
                                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${badgeClasses[item.status]}`}
                                        >
                                            {t(statusLabels[item.status])}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}

                        {!isLoading && bookings.length === 0 && (
                            <div className="py-8 text-center text-sm text-[#8f949a]">
                                {t("admin.history.noBookings")}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default HistoryBookingList;