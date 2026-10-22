import type { CreateBookingOutput } from "@/application/booking/interfaces/CreateBookingUseCaseInterface.js";
import type { ApiResponse, BookingStatus } from "@noq/shared";

interface CreateBookingResponseData {
    bookingId: string;
    status: BookingStatus;
}

export function toCreateBookingResource(
    dto: CreateBookingOutput
): ApiResponse<CreateBookingResponseData> {
    return {
        success: true,
        message: "Booking Created Successfully",
        data: {
            bookingId: dto.bookingId.toString(),
            status: dto.status.getValue(),
        }
    }
}