import { DaySchedule, ScheduleSlot } from "@/features/addBusiness/types";

export const buildNonOverlappingDaySlots = (day: DaySchedule): ScheduleSlot[] => {
    if (!day.enabled || !(day.openStart < day.openEnd)) {
        return [];
    }

    const sortedBreaks = day.breaks
        .filter(
            (b) =>
                b.startTime < b.endTime &&
                b.startTime >= day.openStart &&
                b.endTime <= day.openEnd,
        )
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    const mergedBreaks: { startTime: string; endTime: string }[] = [];

    for (const current of sortedBreaks) {
        const last = mergedBreaks[mergedBreaks.length - 1];

        if (!last || last.endTime < current.startTime) {
            mergedBreaks.push({ ...current });
            continue;
        }

        if (current.endTime > last.endTime) {
            last.endTime = current.endTime;
        }
    }

    const slots: ScheduleSlot[] = [];
    let cursor = day.openStart;

    for (const block of mergedBreaks) {
        if (cursor < block.startTime) {
            slots.push({ startTime: cursor, endTime: block.startTime, block: false });
        }

        slots.push({
            startTime: block.startTime,
            endTime: block.endTime,
            block: true,
        });

        cursor = block.endTime;
    }

    if (cursor < day.openEnd) {
        slots.push({ startTime: cursor, endTime: day.openEnd, block: false });
    }

    if (!slots.length) {
        slots.push({
            startTime: day.openStart,
            endTime: day.openEnd,
            block: false,
        });
    }

    return slots;
};

export const durationToMinutes = (duration: string): number => {
    const [hours, minutes] = duration.split(":").map(Number);
    console.log(duration, hours, minutes)
    return hours * 60 + minutes;
};