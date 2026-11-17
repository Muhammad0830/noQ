import { AdminHistoryBooking } from "@noq/shared";
import { Check, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { FC, useMemo } from "react";

interface HistoryBookingCsvExportProps {
    bookings: AdminHistoryBooking[];
    isExporting: boolean;
    isExportDone: boolean;
    handleExportCsv: () => void;
}

const HistoryBookingCsvExport: FC<HistoryBookingCsvExportProps> = ({
    bookings,
    handleExportCsv,
    isExporting,
    isExportDone,

}) => {
    const t = useTranslations();

    const completedCount = bookings
        .filter((item) => item.status === "COMPLETED")
        .length;

    const revenueTotal = useMemo(
        () => bookings.reduce((sum, item) => {
            if (item.status !== "COMPLETED") return sum;

            return sum + Number(item.servicePrice);
        }, 0), [bookings],
    );

    return (
        <footer className="fixed bottom-16 left-0 right-0 z-30 border-t border-[#d7d9dd] bg-white/95 backdrop-blur-sm md:static md:bottom-auto md:left-auto md:right-auto md:z-auto md:border-t-0 md:bg-transparent md:backdrop-blur-0 flex w-full items-center justify-between gap-4 px-4 pt-3 pb-4 md:px-0 md:pt-1 md:pb-0">
            <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#f0a339]">
                    {t("admin.history.totalRevenue")}
                </p>
                <div className="flex items-baseline gap-2">
                    <p className="text-[30px] font-bold tracking-tight text-[#0f1115]">
                        {revenueTotal}
                    </p>
                    <span className="text-[14px] font-semibold text-[#2aa85d]">
                        +{completedCount}
                    </span>
                </div>
            </div>

            <button
                type="button"
                onClick={handleExportCsv}
                disabled={bookings.length === 0}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#eea338] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(238,163,56,0.35)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:bg-[#d7d9dd] disabled:shadow-none"
            >
                {isExportDone ? (
                    <Check className="h-4 w-4" />
                ) : (
                    <Share2
                        className={`h-4 w-4 ${isExporting ? "animate-pulse" : ""}`}
                    />
                )}
                {isExporting
                    ? t("admin.history.exporting")
                    : isExportDone
                        ? t("admin.history.exportSuccess")
                        : t("admin.history.exportCSV")}
            </button>
        </footer>
    );
}

export default HistoryBookingCsvExport;