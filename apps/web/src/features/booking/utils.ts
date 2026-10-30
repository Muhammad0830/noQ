'use client';

import { getImageUrl } from "@/lib/supabaseClient";
import {
    BookingTabs,
    HistoryCardData,
    InProgressBookingCardData,
} from "./types";
import { BookingItem, formatToDateString, formatToTimeString } from "@noq/shared";

const resolveShopImage = (rawImage?: string | null) => {
    if (!rawImage) return null;
    const trimmedImage = rawImage.trim();
    if (!trimmedImage) return null;

    return trimmedImage.startsWith("http")
        ? trimmedImage
        : getImageUrl("shop_images", trimmedImage);
};

const buildCommonBookingCard = (booking: BookingItem) => {
    console.log(booking.service)
    return {
        id: booking.id,
        shopName: booking.shop.name,
        serviceName: booking.service.name,
        durationMin: `${booking.service.durationMin} min`,
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
        date: formatToDateString(startDate),
        time: formatToTimeString(startDate),
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

export const timeToMinutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

export const minutesToStringTime = (minutes: number) => {
    const m = String(minutes % 60).padStart(2, "0");
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");

    return `${h}:${m}`;
}

export const stringTimeToDateTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const newDate = new Date();

    newDate.setHours(h);
    newDate.setMinutes(m);

    return newDate.getTime();
}

export const getStringTimeFromDate = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return `${year}-${month + 1}-${day}`;
}

export const addMinutes = (time: string, minutes: number) => {
    const [h, m] = time.split(":").map(Number);
    const date = new Date();
    date.setHours(h, m + minutes, 0, 0);
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

export const toRangeMinutes = (value: string) => {
    // If backend returns an ISO datetime (with 'T'), extract the time part
    // without letting the Date constructor apply timezone conversions.
    if (value.includes("T")) {
        const timePart = value.split("T")[1].split(/[Z+-]/)[0];
        const [h, m] = timePart.split(":").map((s) => Number(s));
        return h * 60 + (isNaN(m) ? 0 : m);
    }

    // Plain HH:MM string
    return timeToMinutes(value);
};

export const defaultSelectedDate = {
    date: new Date().toISOString().split('T')[0],
    time: null
}