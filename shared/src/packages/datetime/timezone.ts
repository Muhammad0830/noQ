import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const timeZone = "Asia/Tokyo";

export function localDateTimeToUtc(
    date: string,
    time: string,
    timeZone: string,
): Date {
    return fromZonedTime(`${date}T${time}:00`, timeZone);
}

export function dateToUtc(
  date: string,
  timeZone: string = "Asia/Tashkent",
): string {
  const localMidnight = `${date}T00:00:00`;

  return fromZonedTime(localMidnight, timeZone).toISOString();
}

export function getLocalMinutes(
    value: string | Date,
    timeZone: string,
): number {
    const date = toZonedTime(value, timeZone);

    return date.getHours() * 60 + date.getMinutes();
}