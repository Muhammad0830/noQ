"use client";

import { useEffect, useState } from "react";
import { useShop } from "@/contexts/ShopContext";
import { useTranslations } from "next-intl";
import AdminScheduleTimeline from "@/components/admin/dashboard/AdminScheduleTimeline";
import DashboardMetricCard from "@/components/admin/dashboard/DashboardMetricCard";
import Link from "next/link";
import { Route } from "next";
import DashboardBookingDialog from "@/components/admin/dashboard/DashboardBookingDialog";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
    BarChart3,
    DollarSign,
    Plus,
    Users
} from "lucide-react";
import {
    BookingStatus,
    DashboardBookingItem,
    formatToDateString,
} from "@noq/shared";

const interval = 1 * 60 * 1000; // 1 minutes

const Page = () => {
    const t = useTranslations();
    const { shop } = useShop();

    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedBooking, setSelectedBooking] = useState<DashboardBookingItem | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const {
        baseInfo,
        baseInfoError,
        isBaseInfoError,
        isBaseInfoLoading,

        bookings,
        bookingsError,
        isBookingsLoading,
        isBookingError,
        refetchBookings,

        completeBooking,
        cancelBooking,
        confirmBooking,
        startBooking,

        isCompleting,
        isCancelling,
        isConfirming,
        isStarting,
    } = useAdminDashboard({
        shopId: shop?.id ?? '',
        date: selectedDate
    });

    const openBookingStatusUpdateDialog = (booking: DashboardBookingItem) => {
        setIsDialogOpen(true);
        setSelectedBooking(booking);
    }

    const onBookingStatusChange = (
        status: BookingStatus,
        reason?: string | null
    ) => {
        if (!selectedBooking) return;

        switch (status) {
            case BookingStatus.CANCELLED:
                if (!reason) return;

                cancelBooking({ bookingId: selectedBooking.id, reason }, {
                    onSuccess: () => refetchBookings(),
                });
                break;

            case BookingStatus.COMPLETED:
                completeBooking({ bookingId: selectedBooking.id }, {
                    onSuccess: () => refetchBookings(),
                });
                break;

            case BookingStatus.CONFIRMED:
                confirmBooking({ bookingId: selectedBooking.id }, {
                    onSuccess: () => refetchBookings(),
                });
                break;

            case BookingStatus.IN_PROGRESS:
                startBooking({ bookingId: selectedBooking.id }, {
                    onSuccess: () => refetchBookings(),
                });
                break;

            default:
                return;
        }

        setIsDialogOpen(false);
    };

    if (!shop) {
        return <div>Shop does not exist</div>
    }

    return (
        <div className="min-h-dvh flex flex-col bg-gray-50">
            {isBaseInfoError && baseInfoError && (
                <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {t("admin.dashboard.error.baseInfoPrefix", {
                        message: baseInfoError.message,
                    })}
                </div>
            )}

            <main className="p-3">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between lg:gap-6">
                    <div className="grid flex-1 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-2 lg:gap-4">
                        <DashboardMetricCard
                            label={t("admin.dashboard.revenue")}
                            value={baseInfo.revenue}
                            change={baseInfo.lastWeekRevenueChange}
                            icon={DollarSign}
                            iconClassName="bg-primary"
                            isLoading={isBaseInfoLoading}
                        />
                        <DashboardMetricCard
                            label={t("admin.dashboard.bookings")}
                            value={baseInfo.bookingCount}
                            change={baseInfo.lastWeekBookingCountChange}
                            icon={BarChart3}
                            iconClassName="bg-primary"
                            isLoading={isBaseInfoLoading}
                        />
                    </div>

                    <div className="flex w-full flex-row items-center gap-2 md:w-auto md:min-w-max md:gap-3 lg:ml-4 lg:gap-4">
                        <Link
                            href={`/admin/bookings/new?date=${formatToDateString(selectedDate)}` as Route}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#f49b33] px-3 py-2.5 text-white shadow-lg md:flex-none md:px-3 md:py-2.5 lg:gap-3 lg:px-4 lg:py-3"
                        >
                            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white">
                                <Plus className="h-3.5 w-3.5 text-[#f49b33]" />
                            </div>

                            <span className="text-center text-[9px] font-semibold uppercase leading-tight md:text-[10px] lg:text-xs">
                                {t("admin.dashboard.newAppointment")}
                            </span>
                        </Link>

                        <Link
                            href={"/admin/staff" as Route}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2.5 shadow md:flex-none md:px-3 md:py-2.5 lg:gap-3 lg:px-4 lg:py-3"
                        >
                            <div className="flex h-6 w-6 rounded-full shrink-0 items-center justify-center">
                                <Users className="h-3.5 w-3.5 text-primary md:h-4 md:w-4" />
                            </div>

                            <div className="space-x-1 text-center text-[9px] font-semibold uppercase leading-tight md:text-[10px] lg:text-xs">
                                <span>{t("admin.dashboard.staff")}</span>
                                <span>({isBaseInfoLoading ? "..." : baseInfo.staffCount})</span>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6">
                    <AdminScheduleTimeline
                        currentDate={currentDateTime}
                        selectedDate={selectedDate}
                        bookings={bookings.data}
                        isLoading={isBookingsLoading}
                        isError={isBookingError}
                        errorMessage={bookingsError?.message}
                        onSelectDate={(date) => setSelectedDate(date)}
                        onOpenDialog={openBookingStatusUpdateDialog}
                    />
                </div>
            </main>

            {selectedBooking && (
                <DashboardBookingDialog
                    isOpen={isDialogOpen}
                    isLoading={isCancelling || isCompleting || isConfirming || isStarting}
                    selectedBooking={selectedBooking}
                    onOpenDialog={openBookingStatusUpdateDialog}
                    onCloseDialog={() => setIsDialogOpen(false)}
                    onSubmit={onBookingStatusChange}
                />
            )}
        </div>
    );
}

export default Page;