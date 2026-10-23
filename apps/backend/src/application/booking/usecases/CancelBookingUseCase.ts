import type { CancelBookingUseCaseInput, CancelBookingUseCaseInterface } from "@/application/booking/interfaces/CancelBookingUseCaseInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import type { BookingRepositoryInterface } from "@/domain/booking/repositories/BookingRepositoryInterface.js";

export class CancelBookingUseCase implements CancelBookingUseCaseInterface {
    constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
    ) { }

    async execute(input: CancelBookingUseCaseInput): Promise<void> {
        const bookingId = BookingId.create(input.id);
        const booking = await this.bookingRepository.findById(bookingId);

        const customerId = CustomerId.create(input.userId);

        if (!booking.getCustomerId().equals(customerId)) {
            throw new Error("Forbidden");
        }

        booking.cancel(input.reason ?? "No Reason");
        await this.bookingRepository.save(booking);
    }
}