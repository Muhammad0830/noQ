
import { describe, it, expect } from "vitest";
import { Money } from "../../shared/value-objects/Money.js";
import { Booking } from "../entities/Booking.js";
import { BookingPriceCalculationService } from "./BookingPriceCalculationService.js";
import { Service } from "@/domain/service/entities/Service.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { BookingId } from "../value-objects/BookingId.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

describe("BookingPriceCalculationService", () => {
    it("calculates the final price correctly", () => {
        const bookingId = BookingId.create("booking-1");
        const serviceId = ServiceId.create("service-1");
        const customerId = CustomerId.create("customer-1");
        const shopId = ShopId.create("shop-1");

        const haircut = Service.create({
            id: serviceId,
            shopId,
            name: "Haircut",
            price: Money.fromAmount(80_000, "UZS"),
            durationMin: 30,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const startTime = DateTime.now().addDays(1);

        const booking = Booking.create({
            id: bookingId,
            customerId: customerId,
            shopId: shopId,
            serviceId: haircut.getId(),
            startTime: startTime,
            service: haircut,
        });

        const service = new BookingPriceCalculationService();

        // Act: execute the business operation.
        const result = service.calculateFinalPrice(
            booking,
            5, // % applicationFee
            10, // % discount
        );

        console.log("startTime", booking.getStartTime().getValue())
        console.log("endTime", booking.getEndTime().getValue())

        expect(result.amount).toBe(75_600);
        expect(result.currency).toBe("UZS");
    });
});
