import type { Money } from "@/domain/shared/value-objects/Money.js";
import type { Booking } from "@/domain/booking/entities/Booking.js";

export class BookingPriceCalculationService {
    calculateFinalPrice(
        booking: Booking,
        applicationFee: Money,
        discount: Money
    ) {
        return booking
            .getService()
            .unitPrice
            .add(applicationFee)
            .subtract(discount);
    }
}