import type { BookingWithServiceAndShop } from "@/domain/booking/repositories/BookingRepositoryInterface.js";
import type { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";

export interface BookingListProps {
    bookingList: BookingWithServiceAndShop[];
}

export type BookingListView = "ongoing" | "completed" | "cancelled";

export interface UserBookingItem {
    id: string,
    shopId: string,
    serviceId: string,
    customerId: string,
    startTime: Date,
    endTime: Date,
    status: BookingStatus,
    createdAt: Date,
    shop: {
        id: string;
        name: string;
        address?: string | null;
        backgroundImageUrl?: string | null;
    },
    service: {
        id: string;
        name: string;
        price: number;
        durationMin: number;
    },
}

export interface UserBookingListDTO {
    bookings: UserBookingItem[];
}