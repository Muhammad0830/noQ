import type { BookingListView, UserBookingListDTO } from "@/application/booking/dtos/UserBookingListDTO.js";
import type { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";

export interface UserBookingListQueryInterface {
    execute(input: {
        customerId: CustomerId;
        view: BookingListView;
    }): Promise<UserBookingListDTO>
}