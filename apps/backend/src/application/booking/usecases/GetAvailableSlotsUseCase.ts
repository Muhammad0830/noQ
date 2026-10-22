import type {
    GetAvailableSlotsUseCaseInput,
    GetAvailableSlotsUseCaseInterface,
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
import type { GetBookedSlotListByDateQueryInterface } from "@/domain/booking/repositories/GetBookedSlotListByDateQueryInterface.js";
import type { GetBlockSlotListQueryInterface } from "@/domain/shop-blocks/repositories/GetBlockSlotListQueryInterface.js";
import { createDateTime, minutesToTimeString, SlotStatus, timeToMinutes } from "@noq/shared";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import { TimeSlotAvailabilityService } from "@/domain/shop-schedule/services/TimeSlotAvailabilityService.js";

export class GetAvailableSlotsUseCase implements GetAvailableSlotsUseCaseInterface {
    constructor(
        private readonly getBookedTimesQuery: GetBookedSlotListByDateQueryInterface,
        private readonly scheduleRepository: ShopScheduleRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
        private readonly getBlockSlotListQuery: GetBlockSlotListQueryInterface,
    ) { }

    private readonly timeSlotAvailabilityService = new TimeSlotAvailabilityService();

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
        const blockSchedules = schedules.filter(schedule =>
            schedule.getType().equals(ShopScheduleType.BLOCK)
        );

        if (openSchedules.length === 0) {
            throw new Error("Open Scheduled not found");
        }

        const service = await this.serviceRepository.findById(serviceId);

        if (!service) {
            throw new Error("Service not found");
        }

        if (!service.isActive()) {
            throw new Error("Service is inactive");
        }

        const dayTimeEnd = selectedDate.addDays(1);

        const bookedSlots = await this.getBookedTimesQuery.execute({
            shopId: shopId,
            startTime: selectedDate,
            endTime: dayTimeEnd,
        })

        const emergencyBlockSlots = await this.getBlockSlotListQuery.execute({
            shopId: shopId,
            startTime: selectedDate,
            endTime: dayTimeEnd,
        })

        const regularBlockSlots = blockSchedules.map(schedule => TimeSlot.create({
            start: DateTime.from(createDateTime(
                selectedDate.toDateString(), schedule.getStartTime())),
            end: DateTime.from(createDateTime(
                selectedDate.toDateString(), schedule.getEndTime())),
        }));

        const slots: VisibleSlots[] = [];

        openSchedules.forEach((schedule) => {
            let cursor = timeToMinutes(schedule.getStartTime());
            const close = timeToMinutes(schedule.getEndTime());

            while (cursor + service.getTotalDuration() <= close) {
                const startTime = minutesToTimeString(cursor);
                const endTime = minutesToTimeString(cursor + service.getTotalDuration());

                console.log("working");
                const slotStatus = this.getSlotStatus({
                    regularBlockSlots,
                    emergencyBlockSlots,
                    bookedSlots,
                    startTime,
                    endTime,
                    selectedDate
                })

                slots.push({
                    id: `${shopId}-${selectedDate}-${startTime} `,
                    time: startTime,
                    duration: service.getDuration(),
                    bufferTime: service.getBufferTime() ?? 0,
                    status: slotStatus,
                });

                cursor += service.getTotalDuration();
            }
        })

        return slots;
    }

    private getSlotStatus(input: GetSlotStatusInput): SlotStatus {
        const slotStart = createDateTime(input.selectedDate.toDateString(), input.startTime);
        const slotEnd = createDateTime(input.selectedDate.toDateString(), input.endTime);

        const timeSlot = TimeSlot.create({
            start: DateTime.from(slotStart),
            end: DateTime.from(slotEnd)
        });

        const isRegularBlockConflict = input.regularBlockSlots.some(busySlot => busySlot.overlaps(timeSlot));

        if (isRegularBlockConflict) {
            return SlotStatus.BREAK;
        }

        const isEmergencyBlockConflict = input.emergencyBlockSlots.some(busySlot => busySlot.overlaps(timeSlot));

        if (isEmergencyBlockConflict) {
            return SlotStatus.EMERGENCY;
        }

        const isBookedConflict = input.bookedSlots.some(busySlot => busySlot.overlaps(timeSlot));

        if (isBookedConflict) {
            return SlotStatus.BOOKED;
        }

        return SlotStatus.AVAILABLE;
    }
}