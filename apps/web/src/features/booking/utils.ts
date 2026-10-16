'use client';

import { getImageUrl } from "@/lib/supabaseClient";
import {
    BookingItem,
    BookingTabs,
    HistoryCardData,
    InProgressBookingCardData,
} from "./types";

const resolveShopImage = (rawImage?: string | null) => {
    if (!rawImage) return null;
    const trimmedImage = rawImage.trim();
    if (!trimmedImage) return null;

    return trimmedImage.startsWith("http")
        ? trimmedImage
        : getImageUrl("shop_images", trimmedImage);
};

const buildCommonBookingCard = (booking: BookingItem) => {
    return {
        id: booking.id,
        shopName: booking.shop.name,
        serviceName: booking.service.name,
        duration: `${booking.service.durationMin} min`,
        price: Number(booking.service.price),
        address: booking.shop.address,
        image: resolveShopImage(booking.shop.backgroundImageUrl),
        status: booking.status,
    };
};

export const buildInProgressCard = (
    booking: BookingItem,
): InProgressBookingCardData => {
    const startDate = new Date(booking.startTime);

    const diffMs = startDate.getTime() - Date.now();
    const clampedDiffMs = Number.isFinite(diffMs)
        ? Math.max(diffMs, 0)
        : 0;

    const totalMinutes = Math.floor(clampedDiffMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const showDays = totalHours > 24;

    const totalDays = showDays
        ? Math.floor(totalHours / 24)
        : null;

    const totalRemainingHours = showDays ? 0 : totalHours;
    const remainingMinutes = showDays ? 0 : totalMinutes % 60;

    return {
        ...buildCommonBookingCard(booking),

        city: booking.shop.address,
        remainingDays: totalDays,
        remainingHours: totalRemainingHours,
        remainingMinutes,
        startLabel: startDate.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
        }),
    };
};

export const buildHistoryCard = (
    booking: BookingItem,
): HistoryCardData => {
    const startDate = new Date(booking.startTime);

    return {
        ...buildCommonBookingCard(booking),

        date: startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
        }),
        time: startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }),
    };
};

export const tabs: Array<{ key: BookingTabs; label: string }> = [
    { key: BookingTabs.IN_PROGRESS, label: "user.history.tab.in_progress" },
    { key: BookingTabs.COMPLETED, label: "user.history.tab.completed" },
    { key: BookingTabs.CANCELLED, label: "user.history.tab.cancelled" },
];