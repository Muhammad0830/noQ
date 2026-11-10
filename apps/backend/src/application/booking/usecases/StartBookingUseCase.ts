import {
    StartBookingUseCaseInput,
    StartBookingUseCaseInterface
} from "../interfaces/StartBookingUseCaseInterface.js";
import { BookingRepositoryInterface } from
    "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class StartBookingUseCase implements StartBookingUseCaseInterface {
    constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
    ) { }

    async execute(input: StartBookingUseCaseInput): Promise<void> {
        const bookingId = BookingId.create(input.id);

        const booking = await this.bookingRepository.findById(bookingId);

        const shopId = ShopId.create(input.shopId);

        if (!booking.getShopId().equals(shopId)) {
            throw new Error("Forbidden");
        }

        booking.start();

        await this.bookingRepository.save(booking);
    }
}