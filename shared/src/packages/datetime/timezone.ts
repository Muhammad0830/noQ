import { fromZonedTime, toZonedTime as _toZonedTime } from "date-fns-tz";

export function localDateTimeToUtc(
    date: string,
    time: string,
    timezone: string,
): Date {
    return fromZonedTime(`${date}T${time}:00`, timezone);
}

export function dateToUtc(
    date: string,
    timezone: string = "Asia/Tashkent",
): string {
    const localMidnight = `${date}T00:00:00`;

    return fromZonedTime(localMidnight, timezone).toISOString();
}

export function getLocalMinutes(
    value: string | Date,
    timezone: string,
): number {
    const date = _toZonedTime(value, timezone);

    return date.getHours() * 60 + date.getMinutes();
}

export function toZonedTime(date: Date | string, timezone: string) {
    const newDate = new Date(date);

    return _toZonedTime(newDate, timezone);
}