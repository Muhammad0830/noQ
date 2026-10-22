import type { BookingListView, UserBookingListDTO } from "@/application/booking/dtos/UserBookingListDTO.js";

export interface GetUserBookingListInput {
    customerId: string;
    view: BookingListView;
}

export type GetUserBookingListOutput = Promise<UserBookingListDTO>

export interface GetUserBookingListUseCaseInterface {
    execute(input: GetUserBookingListInput): GetUserBookingListOutput;
}