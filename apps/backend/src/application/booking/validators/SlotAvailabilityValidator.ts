import { SlotStatus } from "@noq/shared";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { GetSlotStatusInput } from
    "@/application/booking/interfaces/GetAvailableSlotsUseCaseInterface.js";

export class SlotAvailabilityValidator {
    validate(input: GetSlotStatusInput): SlotStatus {
        const slotStart = DateTime.fromDateAndTime(input.selectedDate.toDateString(), input.startTime)
        const slotEnd = DateTime.fromDateAndTime(input.selectedDate.toDateString(), input.endTime)

        const timeSlot = TimeSlot.create({
            start: slotStart,
            end: slotEnd,
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