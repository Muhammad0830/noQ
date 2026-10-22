import type { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import type { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import type { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";

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
    shopId: ShopId;
    startTime: string;
    endTime: string;
    dayOfWeek: DayOfWeek;
}