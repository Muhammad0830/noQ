import type {
    GetAvailableSlotsUseCaseInput,
    GetAvailableSlotsUseCaseInterface,
    GetSlotListInput,
    GetSlotStatusInput,
    VisibleSlots,
} from "../interfaces/GetAvailableSlotsUseCaseInterface.js";
import type { ShopScheduleRepositoryInterface } from
    "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { ShopScheduleType } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";
import type { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import type { GetBlockSlotListQueryInterface } from "@/application/booking/read-queries/GetBlockSlotListQueryInterface.js";
import type { GetBookedSlotListByDateQueryInterface } from "@/application/booking/read-queries/GetBookedSlotListByDateQueryInterface.js";
import { createDateTime, minutesToTimeString, SlotStatus, timeToMinutes } from "@noq/shared";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import type { SlotAvailabilityValidator } from "../validators/SlotAvailabilityValidator.js";

export class GetAvailableSlotsUseCase implements GetAvailableSlotsUseCaseInterface {
    constructor(
        private readonly getBookedTimesQuery: GetBookedSlotListByDateQueryInterface,
        private readonly scheduleRepository: ShopScheduleRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
        private readonly getBlockSlotListQuery: GetBlockSlotListQueryInterface,
        private readonly slotAvailabilityValidator: SlotAvailabilityValidator,
    ) { }

    async execute(input: GetAvailableSlotsUseCaseInput): Promise<VisibleSlots[]> {
        const shopId = ShopId.create(input.shopId);
        const serviceId = ServiceId.create(input.serviceId);
        const selectedDate = DateTime.from(input.date);
        const dayOfWeek = DayOfWeek.fromDate(selectedDate);

        const schedules = await this.scheduleRepository.getByShopId(
            shopId,
            dayOfWeek,
        );

        const openSchedules = schedules.filter(schedule =>
            schedule.getType().equals(ShopScheduleType.OPEN)
        );

        if (openSchedules.length === 0) {
            throw new Error("Open Scheduled not found");
        }

        const service = await this.serviceRepository.findById(serviceId);

        if (!service.isActive()) {
            throw new Error("Service is inactive");
        }

        const bookedSlots = await this.getBookedTimesQuery.execute({
            shopId: shopId,
            startTime: selectedDate,
            endTime: selectedDate.addDays(1),
        })

        const emergencyBlockSlots = await this.getBlockSlotListQuery.execute({
            shopId: shopId,
            startTime: selectedDate,
            endTime: selectedDate.addDays(1),
        })

        return this.generateSlots({
            shopId: shopId,
            service: service,
            schedules: schedules,
            emergencyBlockSlots: emergencyBlockSlots,
            bookedSlots: bookedSlots,
            selectedDate: selectedDate,
        });
    }

    private generateSlots(input: GetSlotListInput): VisibleSlots[] {
        const openSchedules = input.schedules.filter(schedule =>
            schedule.getType().equals(ShopScheduleType.OPEN)
        );

        const blockSchedules = input.schedules.filter(schedule =>
            schedule.getType().equals(ShopScheduleType.BLOCK)
        );

        const selectedDateString = input.selectedDate.toDateString();

        const regularBlockSlots = blockSchedules.map(schedule => TimeSlot.create({
            start: DateTime.from(createDateTime(selectedDateString, schedule.getStartTime())),
            end: DateTime.from(createDateTime(selectedDateString, schedule.getEndTime())),
        }));

        const slots: VisibleSlots[] = [];

        openSchedules.forEach((schedule) => {
            let cursor = timeToMinutes(schedule.getStartTime());
            const close = timeToMinutes(schedule.getEndTime());

            while (cursor + input.service.getTotalDuration() <= close) {
                const startTime = minutesToTimeString(cursor);
                const endTime = minutesToTimeString(cursor + input.service.getTotalDuration());

                const slotStatus = this.slotAvailabilityValidator.validate({
                    regularBlockSlots: regularBlockSlots,
                    emergencyBlockSlots: input.emergencyBlockSlots,
                    bookedSlots: input.bookedSlots,
                    startTime: startTime,
                    endTime: endTime,
                    selectedDate: input.selectedDate,
                })

                slots.push({
                    id: `${input.shopId}-${input.selectedDate}-${startTime} `,
                    time: startTime,
                    duration: input.service.getDuration(),
                    bufferTime: input.service.getBufferTime() ?? 0,
                    status: slotStatus,
                });

                cursor += input.service.getTotalDuration();
            }
        });

        return slots;
    }
}