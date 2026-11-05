import { BookingRepositoryInterface } from "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { CompleteBookingUseCaseInput, CompleteBookingUseCaseInterface } from "../interfaces/CompleteBookingUseCaseInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class CompleteBookingUseCase implements CompleteBookingUseCaseInterface {
    constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
    ) {}

    async execute(input: CompleteBookingUseCaseInput): Promise<void> {
        const bookingId = BookingId.create(input.id);

        const booking = await this.bookingRepository.findById(bookingId);

        const shopId = ShopId.create(input.shopId);

        if(!booking.getShopId().equals(shopId)) {
            throw new Error("Forbidden");
        }

        booking.complete();

        await this.bookingRepository.save(booking);
    }
}