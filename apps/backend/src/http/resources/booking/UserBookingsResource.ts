import type { UserBookingListDTO } from "@/application/booking/dtos/UserBookingListDTO.js";
import type { BookingItem } from "@noq/shared";

export function toBookingResource(dto: UserBookingListDTO): BookingItem[] {
    return dto.bookings.map(booking => ({
        id: booking.id,
        userId: booking.customerId,
        shopId: booking.shopId,
        serviceId: booking.serviceId ?? null,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status.getValue(),
        createdAt: booking.createdAt,
        service: booking.service ? {
            id: booking.service.id,
            name: booking.service.name,
            price: booking.service.price,
            durationMin: booking.service.durationMin,
        } : null,
        shop: {
            id: booking.shop.id,
            name: booking.shop.name,
            address: booking.shop.address,
            backgroundImageUrl: booking.shop.backgroundImageUrl,
        }
    }));
}