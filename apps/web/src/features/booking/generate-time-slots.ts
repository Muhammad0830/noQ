
import { getLocalMinutes, timeZone } from "@noq/shared";
import type { ScheduleSlot, DayTimelineResponse } from "./types";

interface GenerateTimeSlotsParams {
    shopId: string;
    date: string | null;
    durationMin: number;
    timeline: DayTimelineResponse | undefined;
    intervalMin?: number;
}

function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function localDateTime(date: string, time: string): Date {
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

export function generateTimeSlots({
    shopId,
    date,
    durationMin,
    timeline,
}: GenerateTimeSlotsParams): ScheduleSlot[] {
    if (
        !date ||
        !timeline?.open ||
        !timeline.close ||
        durationMin <= 0 ||
        durationMin <= 0
    ) {
        return [];
    }

    const openMin = timeToMinutes(timeline.open);
    const closeMin = timeToMinutes(timeline.close);

    if (closeMin <= openMin) {
        return [];
    }

    const busyRanges = timeline.busy ?? [];
    const disabledRanges = timeline.disabled ?? [];
    const now = new Date();
    const slots: ScheduleSlot[] = [];

    for (
        let startMin = openMin;
        startMin + durationMin <= closeMin;
        startMin += durationMin
    ) {
        const endMin = startMin + durationMin;
        const time = minutesToTime(startMin);

        if (localDateTime(date, time) <= now) {
            continue;
        }

        const overlaps = (
            ranges: { start: string; end: string }[],
        ) =>
            ranges.some((range) => {
                const rangeStart = getLocalMinutes(range.start, timeZone);
                const rangeEnd = getLocalMinutes(range.end, timeZone);

                // Half-open intervals: [start, end)
                return rangeStart < endMin && rangeEnd > startMin;
            });

        const isBooked = overlaps(busyRanges);
        const isDisabled = overlaps(disabledRanges);

        slots.push({
            id: `${shopId}-${date}-${time}`,
            time,
            startMin,
            type: isBooked
                ? "booked"
                : isDisabled
                    ? "break"
                    : "available",
        });
    }

    return slots;
}
