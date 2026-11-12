"use client"

import { FC, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { useTranslations } from "next-intl";
import { BookingStatus, DashboardBookingItem, formatToTimeString } from "@noq/shared";
import { CircleCheckBig, CircleX } from "lucide-react";
import DashboardConfirmDialog from "./DashboardConfirmDialog";
import { cn } from "cn";
import { canTransitionTo } from "@/lib/utils";

interface DashboardBookingDialogProps {
    isOpen: boolean;
    isLoading: boolean;
    selectedBooking: DashboardBookingItem;
    onOpenDialog: (booking: DashboardBookingItem) => void;
    onCloseDialog: () => void;
    onSubmit: (value: BookingStatus, reason?: string | null) => void;
}

const DashboardBookingDialog: FC<DashboardBookingDialogProps> = ({
    isOpen,
    selectedBooking,
    isLoading,
    onOpenDialog,
    onCloseDialog,
    onSubmit,
}) => {
    const t = useTranslations();

    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);

    const onOpenChange = (value: boolean) => {
        if (value) {
            onOpenDialog(selectedBooking);
        } else {
            onCloseDialog();
            setSelectedStatus(null);
        }
    }

    const onOpenConfirmChange = (value: boolean) => {
        if (value) {
            setIsConfirmDialogOpen(true)
        } else {
            onClose();
        }
    }

    const onClose = () => {
        setIsConfirmDialogOpen(false)
        onCloseDialog();
        setSelectedStatus(null);
    }

    const onConfirm = (reason?: string | null) => {
        if (selectedStatus) {
            onSubmit(selectedStatus, reason)
        }

        setIsConfirmDialogOpen(false);
        setSelectedStatus(null);
    }

    const openConfirmDialog = (status: BookingStatus | null) => {
        if (status) {
            onCloseDialog()
            setIsConfirmDialogOpen(true)
            setSelectedStatus(status)
        }
    }

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[90vw] p-4">
                    <DialogTitle className="capitalize w-9/10 leading-6">
                        {t("admin.dashboard.booking_dialog_title")}
                    </DialogTitle>

                    <div className="flex flex-col gap-2">
                        <p className="mb-0! pb-0! text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {t("admin.dashboard.model_details")}
                        </p>

                        <div className="rounded-2xl border border-orange-100 bg-orange-50/80 p-3">
                            <div className="grid grid-cols-[1fr_auto] gap-3">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        {t("admin.schedule.title") || "Schedule"}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-slate-900">
                                        {formatToTimeString(selectedBooking.startTime)} - {formatToTimeString(selectedBooking.endTime)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                        {t("booking_status.status")}
                                    </p>
                                    <p className="mt-1 text-xs font-semibold text-[#f49b33]">
                                        {t(`booking_status.${selectedBooking.status}`)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className=" flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                {t("admin.dashboard.booking_details")}
                            </p>

                            <div className="text-xs leading-5 text-slate-700">
                                <div className="flex justify-between gap-2">
                                    <span className="flex-1 truncate">{t("admin.dashboard.customer_name")}</span>
                                    <span className="flex-1 truncate text-end">{selectedBooking.customer.name}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="flex-1 truncate">{t("admin.dashboard.customer_phone")}</span>
                                    <span className="flex-1 truncate text-end">{selectedBooking.customer.phoneNumber ?? '-'}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="flex-1 truncate">{t("admin.dashboard.service_name")}</span>
                                    <span className="flex-1 truncate text-end">{selectedBooking.serviceName}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="flex-1 truncate">{t("admin.dashboard.service_price")}</span>
                                    <span className="flex-1 truncate text-end">{selectedBooking.servicePrice} {t("common.sum")}</span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {t("admin.dashboard.select_status")}
                        </p>

                        {Object.values(BookingStatus).map((status) =>
                            status !== BookingStatus.PENDING && status !== BookingStatus.NO_SHOW && (
                                <button
                                    key={status}
                                    disabled={!canTransitionTo(selectedBooking.status, status)}
                                    className={cn(
                                        "text-start px-2 py-2 rounded-sm border border-[#f49b33]/50 transition-all duration-150",
                                        selectedStatus === status && "bg-[#f49b33] text-white font-bold",
                                        !canTransitionTo(selectedBooking.status, status) && "opacity-50 border-slate-200"
                                    )}
                                    onClick={() => setSelectedStatus(status)}
                                >
                                    {t(`booking_status.${status}`)}
                                </button>
                            )
                        )}

                        <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            {t("common.continue?")}
                        </p>

                        <div className="grid grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedStatus(null);
                                    onCloseDialog()
                                }}
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
                                onClick={() => openConfirmDialog(selectedStatus)}
                                disabled={isLoading || !selectedStatus}
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
                    </div>
                </DialogContent>
            </Dialog>

            {selectedStatus && (
                <DashboardConfirmDialog
                    isLoading={isLoading}
                    isConfirmDialogOpen={isConfirmDialogOpen}
                    selectedStatus={selectedStatus}
                    selectedBookingStatus={selectedBooking.status}
                    onOpenConfirmChange={onOpenConfirmChange}
                    onConfirm={onConfirm}
                    onClose={onClose}
                />
            )}
        </div>
    );
}

export default DashboardBookingDialog;