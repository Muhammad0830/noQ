import { getImageUrl } from "@/lib/supabaseClient";
import {
    ActiveBookingItem,
    HistoryBookingItem,
    HistoryCardData,
    OngoingBookingCardData,
} from "./bookings.types";

const resolveShopImage = (rawImage?: string | null) => {
    if (!rawImage) return null;
    const trimmedImage = rawImage.trim();
    if (!trimmedImage) return null;

    return trimmedImage.startsWith("http")
        ? trimmedImage
        : getImageUrl(trimmedImage, "shop_images");
};

export const buildOngoingCard = (
    booking: ActiveBookingItem,
): OngoingBookingCardData => {
    const startDate = new Date(booking.startTime);
    const diffMs = startDate.getTime() - Date.now();
    const clampedDiffMs = Number.isFinite(diffMs) ? Math.max(diffMs, 0) : 0;
    const totalMinutes = Math.floor(clampedDiffMs / 60000);
    const totalHours = Math.floor(totalMinutes / 60);
    const showDays = totalHours > 24;

    const remainingDays = showDays ? Math.floor(totalHours / 24) : null;
    const remainingHours = showDays ? 0 : totalHours;
    const remainingMinutes = showDays ? 0 : totalMinutes % 60;

    const addressParts = booking.shop.address
        ?.split(",")
        .map((part) => part.trim())
        .filter(Boolean);
    const city = addressParts?.[1] || addressParts?.[0] || "Location";

    return {
        id: booking.id,
        shopName: booking.shop.name,
        service: booking.service.name,
        duration: `${booking.service.durationMin} min`,
        price: Number(booking.service.price),
        status: "ongoing",
        address: booking.shop.address,
        city,
        subtitle: booking.status,
        remainingDays,
        remainingHours,
        remainingMinutes,
        startLabel: startDate.toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
        }),
        image: resolveShopImage(booking.shop.backgroundImageUrl),
    };
};

export const buildHistoryCard = (
    booking: HistoryBookingItem,
    status: "completed" | "cancelled",
): HistoryCardData => {
    const startDate = new Date(booking.startTime);

    return {
        id: booking.id,
        shopName: booking.shop?.name || "Unknown Shop",
        service: booking.service?.name || "Unknown Service",
        date: startDate.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
        }),
        time: startDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
        }),
        duration: `${booking.service?.durationMin ?? 0} min`,
        price: Number(booking.service?.price ?? 0),
        status,
        address: booking.shop?.address || "Address unavailable",
        cancelReason: booking.cancelReason || booking.reason || undefined,
        image: resolveShopImage(booking.shop?.backgroundImageUrl),
    };
};
