import type { BookingRepositoryInterface } from
    "@/domain/booking/repositories/BookingRepositoryInterface.js";
import type {
    CreateBookingInput,
    CreateBookingOutput,
    CreateBookingUseCaseInterface,
} from "@/application/booking/interfaces/CreateBookingUseCaseInterface.js";
import type { ServiceRepositoryInterface } from
    "@/domain/service/repositories/ServiceRepositoryInterface.js";
import type { CustomerRepositoryInterface } from
    "@/domain/customer/repositories/CustomerRepositoryInterface.js";
import type { BookingAvailabilityCheckerQueryInterface } from
    "@/application/booking/read-queries/BookingAvailabilityCheckerQueryInterface.js";
import { Booking } from "@/domain/booking/entities/Booking.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import { createDateTime } from "@noq/shared";
import type { ScheduleValidator } from "../validators/ScheduleValidator.js";
import type { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";

export class CreateBookingUseCase implements CreateBookingUseCaseInterface {
    public constructor(
        private readonly bookingRepository: BookingRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
        private readonly customerRepository: CustomerRepositoryInterface,
        private readonly availabilityCheckerQuery: BookingAvailabilityCheckerQueryInterface,
        private readonly scheduleRepository: ShopScheduleRepositoryInterface,
        private readonly scheduleValidator: ScheduleValidator,
    ) { }

    async execute(
        input: CreateBookingInput,
    ): Promise<CreateBookingOutput> {
        const shopId = ShopId.create(input.shopId);
        const serviceId = ServiceId.create(input.serviceId);
        const customerId = CustomerId.create(input.customerId);

        const service = await this.serviceRepository.findById(serviceId);

        if (!shopId.equals(service.getShopId())) {
            throw new Error("Selected service does not belong to selected Shop");
        }

        await this.customerRepository.findById(customerId);

        const startTime = DateTime.from(
            createDateTime(input.date, input.startTime)
        );
        const bookingId = this.bookingRepository.nextIdentity();

        const booking = Booking.create({
            id: bookingId,
            serviceId: serviceId,
            customerId: customerId,
            shopId: shopId,
            startTime: startTime,
            service: service,
        });

        const schedules = await this.scheduleRepository
            .getByShopId(shopId, DayOfWeek.fromDate(startTime));

        await this.scheduleValidator.validate({
            schedules: schedules,
            startTime: input.startTime,
            endTime: booking.getEndTime().toTimeString(),
        })

        const hasConflictWithBookingTime = await this.availabilityCheckerQuery.hasConflict({
            shopId,
            startTime,
            endTime: booking.getEndTime(),
        })

        if (hasConflictWithBookingTime) {
            throw new Error("Selected time is not available")
        }

        await this.bookingRepository.add(booking);

        return {
            bookingId: booking.getId(),
            status: booking.getStatus(),
        }
    }
}