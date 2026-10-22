import type { Money } from "@/domain/shared/value-objects/Money.js";
import type { Booking } from "@/domain/booking/entities/Booking.js";
import { Discount } from "@/domain/shared/value-objects/Discount.js";

// the reason why not write this in entity is entity should not know about project discount or application fee policy.
export interface BookingPriceBreakdown {
    servicePrice: Money,
    applicationFee: Money,
    discount: Money,
    finalPrice: Money,
}

export class BookingPriceCalculationService {
    calculateFinalPrice(
        booking: Booking,
        applicationFeePercentage: number,
        discountPercentage: number
    ) {
        return this.calculateBreakdown(
            booking,
            applicationFeePercentage,
            discountPercentage,
        ).finalPrice;
    }

    calculateBreakdown(
        booking: Booking,
        applicationFeePercentage: number,
        discountPercentage: number,
    ): BookingPriceBreakdown {
        const servicePrice = booking.getService().getPrice();

        const applicationFee = Discount.percentage(servicePrice, applicationFeePercentage);
        const amountBeforeDiscount = servicePrice.add(applicationFee.money);
        const discount = Discount.percentage(amountBeforeDiscount, discountPercentage)
        const finalPrice = discount.applyTo(amountBeforeDiscount);

        return {
            servicePrice,
            applicationFee: applicationFee.money,
            discount: discount.money,
            finalPrice,
        }
    }
}