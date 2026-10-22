import type { BookingWithServiceAndShop } from "@/domain/booking/repositories/BookingRepositoryInterface.js";

export interface BookingListProps {
    bookingList: BookingWithServiceAndShop[];
}

export interface HistoryBookingListDTO {
    id: string;
    shopId: string;
}