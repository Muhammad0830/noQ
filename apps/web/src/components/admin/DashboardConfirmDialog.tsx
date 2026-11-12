"use client"

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { CircleCheckBig, CircleX } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "cn";
import { BookingStatus } from "@noq/shared";

const cancellationReasonOptions = [
    {
        id: 1,
        content: "change_of_plans",
    },
    {
        id: 2,
        content: "booked_by_mistake",
    },
    {
        id: 3,
        content: "no_longer_need",
    },
    {
        id: 4,
        content: "financial_reasons",
    },
    {
        id: 5,
        content: "unable_to_contact_customer",
    },
    {
        id: 6,
        content: "other",
    }
]

interface DashboardConfirmDialogProps {
    isLoading: boolean,
    isConfirmDialogOpen: boolean,
    selectedStatus: BookingStatus,
    selectedBookingStatus: BookingStatus,
    onOpenConfirmChange: (value: boolean) => void;
    onConfirm: (reason?: string | null) => void;
    onClose: () => void;
}

const DashboardConfirmDialog: FC<DashboardConfirmDialogProps> = ({
    isLoading,
    isConfirmDialogOpen,
    selectedStatus,
    selectedBookingStatus,
    onOpenConfirmChange,
    onConfirm,
    onClose,
}) => {
    const t = useTranslations();
    const [cancellationReason, setCancellationReason] = useState<string | null>(null);

    return (
        <Dialog onOpenChange={onOpenConfirmChange} open={isConfirmDialogOpen}>
            <DialogContent className="max-w-[90vw] p-4">
                <DialogTitle className="capitalize w-9/10 leading-6">
                    {t(`admin.dashboard.confirm_modal_title.${selectedStatus}`)}
                </DialogTitle>


                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center gap-2 p-2.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <span className="text-xs uppercase">{t("common.now")}</span>

                        <div className="text-xs border rounded-full px-2 border-orange-200 bg-orange-50 text-[#f49b33] uppercase">
                            {t(`booking_status.${selectedBookingStatus}`)}
                        </div>
                    </div>

                    <div className="flex justify-between items-center gap-2 p-2.5 rounded-2xl border border-slate-200 bg-slate-50">
                        <span className="text-xs uppercase">{t("common.after")}</span>

                        <div className={cn("text-xs uppercase border rounded-full px-2",
                            selectedStatus === BookingStatus.CANCELLED
                                ? "text-red-600 border-red-200 bg-red-50"
                                : selectedStatus === BookingStatus.COMPLETED
                                    ? "text-green-500 border-green-200 bg-green-50"
                                    : "text-[#f49b33] border-orange-200 bg-orange-50")
                        }>
                            {t(`booking_status.${selectedStatus}`)}
                        </div>
                    </div>
                </div>

                {selectedStatus === BookingStatus.CANCELLED && (
                    <div className="flex flex-col gap-1">
                        <p className="mb-1">{t("admin.dashboard.select_cancellation_reason")}</p>
                        {cancellationReasonOptions.map(reason => (
                            <button
                                key={reason.id}
                                className={cn(
                                    "px-2 py-2 rounded-sm border border-[#f49b33]/50 bg-[#f49b33]/10 transition-all duration-150",
                                    cancellationReason === reason.content && "bg-[#f49b33] text-white font-bold"
                                )}
                                onClick={() => setCancellationReason(reason.content)}
                            >
                                {t(`admin.dashboard.cancellation_reason.${reason.content}`)}
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-2.5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 text-xs font-semibold text-red-600 shadow-sm transition hover:border-red-300 hover:bg-red-100 disabled:opacity-60"
                    >
                        <CircleX className="h-3.5 w-3.5" />

                        <span className="uppercase">
                            {isLoading
                                ? t("common.loading")
                                : t("common.no")}
                        </span>
                    </button>

                    <button
                        type="button"
                        disabled={
                            isLoading ||
                            (selectedStatus === BookingStatus.CANCELLED && !cancellationReason)
                        }
                        onClick={() => {
                            if (selectedStatus === BookingStatus.CANCELLED && !cancellationReason) {
                                return;
                            }

                            onConfirm(cancellationReason)
                        }}
                        className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-500 px-3 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(34,197,94,0.3)] transition hover:bg-green-600 disabled:opacity-60"
                    >
                        <CircleCheckBig className="h-3.5 w-3.5" />

                        <span className="uppercase">
                            {isLoading
                                ? t("common.loading")
                                : t("common.yes")}
                        </span>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default DashboardConfirmDialog;