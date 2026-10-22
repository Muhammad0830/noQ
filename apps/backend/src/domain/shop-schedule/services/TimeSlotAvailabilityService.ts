import type { TimeSlot } from "../../shared/value-objects/TimeSlot.js";

export class TimeSlotAvailabilityService {
    isAvailable(
        requested: TimeSlot,
        existingList: TimeSlot[],
    ) {
        return !existingList.some(existing => requested.overlaps(existing));
    }
}