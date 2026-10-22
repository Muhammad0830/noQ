import type { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import type { Booking } from "../entities/Booking.js";
import type { BookingId } from "../value-objects/BookingId.js";
import type { BookingStatus } from "../value-objects/BookingStatus.js";
import type { Prisma } from "@prisma/client";

export type BookingWithServiceAndShop = Prisma.BookingGetPayload<{
    include: {
        shop: true,
        service: true,
    }
}>

export type BookingWithService = Prisma.BookingGetPayload<{
    include: {
        service: true;
    }
}>

export interface BookingRepositoryInterface {
    findById(id: BookingId): Promise<Booking>;

    getByStartTimeForCustomers(
        customerId: CustomerId,
        statusList: BookingStatus[],
        futureOnly?: boolean,
    ): Promise<Booking[]>;

    add(booking: Booking): Promise<void>;

    save(booking: Booking): Promise<void>;

    nextIdentity(value?: string): BookingId;
}