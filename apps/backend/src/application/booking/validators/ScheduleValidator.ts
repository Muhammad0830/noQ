import type { isSelectedTimeAvailableInput } from "../interfaces/CreateBookingUseCaseInterface.js";
import { isTimeBetween } from "@noq/shared";

export class ScheduleValidator {
    async validate(input: isSelectedTimeAvailableInput): Promise<void> {
        const openSchedules = input.schedules.filter(schedule => schedule.getType().isOpen());
        const blockSchedules = input.schedules.filter(schedule => !schedule.getType().isOpen());

        if (openSchedules.length === 0) {
            throw new Error("Schedules for selected day not found");
        }

        const isWithinWorkingHours = openSchedules.some(schedule =>
            isTimeBetween({
                targetStartStr: input.startTime,
                targetEndStr: input.endTime,
                startStr: schedule.getStartTime(),
                endStr: schedule.getEndTime()
            })
        );

        if (!isWithinWorkingHours) {
            throw new Error("Booking is outside of working hours");
        }

        const overlapsWithBreakTimes = blockSchedules.some(schedule =>
            isTimeBetween({
                targetStartStr: input.startTime,
                targetEndStr: input.endTime,
                startStr: schedule.getStartTime(),
                endStr: schedule.getEndTime()
            })
        );

        if (overlapsWithBreakTimes) {
            throw new Error("Selected time overlaps with break time");
        }
    }
}