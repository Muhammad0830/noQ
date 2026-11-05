import { BookingRepositoryInterface } from "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { ConfirmBookingUseCaseInput, ConfirmBookingUseCaseInterface } from "../interfaces/ConfirmBookingUseCaseInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class ConfirmBookingUseCase implements ConfirmBookingUseCaseInterface {
    constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
    ) { }

    async execute(input: ConfirmBookingUseCaseInput): Promise<void> {
        const bookingId = BookingId.create(input.id);

        const booking = await this.bookingRepository.findById(bookingId);

        const shopId = ShopId.create(input.shopId);

        if (!booking.getShopId().equals(shopId)) {
            throw new Error("Forbiden");
        }

        booking.confirm();

        await this.bookingRepository.save(booking);
    }
}