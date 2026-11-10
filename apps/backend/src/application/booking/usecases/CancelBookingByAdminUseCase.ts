import {
    CancelBookingByAdminUseCaseInput,
    CancelBookingByAdminUseCaseInterface
} from "../interfaces/CancelBookingByAdminUseCaseInterface.js";
import { BookingRepositoryInterface } from
    "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class CancelBookingByAdminUseCase implements CancelBookingByAdminUseCaseInterface {
    constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
    ) { }

    async execute(input: CancelBookingByAdminUseCaseInput): Promise<void> {
        const bookingId = BookingId.create(input.id);

        const booking = await this.bookingRepository.findById(bookingId);

        const shopId = ShopId.create(input.shopId);

        if (!booking.getShopId().equals(shopId)) {
            throw new Error("Forbidden");
        }

        booking.cancel(input.reason);

        await this.bookingRepository.save(booking);
    }
}