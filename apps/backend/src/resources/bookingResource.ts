import type { Booking } from "@shared/types/general_types.js";

export const bookingResource = (booking: Booking) => ({
    id: booking.id,
    status: booking.status,
    startTime: booking.startTime,
    endTime: booking.endTime,

    shop: booking.shop ? {
        id: booking.shop.id,
        name: booking.shop.name,
        address: booking.shop.address,
        backgroundImageUrl: booking.shop.backgroundImageUrl,
    } : undefined,

    service: booking.service ? {
        id: booking.service.id,
        name: booking.service.name,
        price: booking.service.price,
        durationMin: booking.service.durationMin,
    } : undefined,
});