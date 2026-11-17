import {
    addMinutes as _addMinutesDate,
    differenceInMilliseconds as _differenceInMilliseconds,
    differenceInMinutes,
    format,
    isWithinInterval,
    parse,
    startOfDay,
    subMilliseconds as _subMilliseconds,
} from 'date-fns';

export const timeToMinutes = (time: string): number => {
    const date = parse(time, "HH:mm", new Date(0));
    return differenceInMinutes(date, startOfDay(date));
};

export function addMinutes(isoString: string | Date, minutes: number): Date {
    return _addMinutesDate(new Date(isoString), minutes);
}

export function isTimeBetween({
    targetStartStr,
    targetEndStr,
    startStr,
    endStr
}: {
    startStr: string, // 12:15
    endStr: string // 17:30
    targetStartStr: string, // 16:50
    targetEndStr?: string, // 16:50
}): boolean {
    const referenceDate = new Date(); // base date for parsing

    const targetStart = parse(targetStartStr, 'HH:mm', referenceDate);
    const targetEnd = targetEndStr ? parse(targetEndStr, 'HH:mm', referenceDate) : null;
    const start = parse(startStr, 'HH:mm', referenceDate);
    const end = parse(endStr, 'HH:mm', referenceDate);

    return targetEnd
        ? isWithinInterval(targetStart, { start, end }) && isWithinInterval(targetEnd, { start, end })
        : isWithinInterval(targetStart, { start, end });
}

export function formatToTimeString(value: Date | string) {
    const date = new Date(value);
    return format(date, 'HH:mm');
}

export function minutesToTimeString(totalMinutes: number) {
    const baseDate = startOfDay(new Date()); // base date for parsing with 00:00
    const targetDate = addMinutes(baseDate, totalMinutes);
    return formatToTimeString(targetDate);
}

export function differenceInMilliseconds(endTime: Date | string, startTime: Date | string) {
    return _differenceInMilliseconds(endTime, startTime)
}

export function subMilliseconds(startTime: Date | string, duration: number) {
    return _subMilliseconds(startTime, duration);
}