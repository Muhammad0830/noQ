import type { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import type { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import type { ShopSchedule } from "@/domain/shop-schedule/entities/ShopSchedule.js";

export interface CreateBookingInput {
    customerId: string;
    shopId: string;
    date: string;
    startTime: string;
    serviceId: string;
}

export interface CreateBookingOutput {
    bookingId: BookingId;
    status: BookingStatus;
}

export interface CreateBookingUseCaseInterface {
    execute(input: CreateBookingInput): Promise<CreateBookingOutput>;
}

export interface IsSelectedDateAvailableOutput {
    success: boolean;
    error?: string;
}

export interface isSelectedTimeAvailableInput {
    schedules: ShopSchedule[];
    startTime: string;
    endTime: string;
}