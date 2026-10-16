import { formatInTimeZone } from "date-fns-tz";

export function formatTime(
  value: string | Date,
  timeZone: string,
): string {
  return formatInTimeZone(value, timeZone, "HH:mm");
}

export function formatDate(
  value: string | Date,
  timeZone: string,
): string {
  return formatInTimeZone(value, timeZone, "yyyy-MM-dd");
}

export function formatDateTime(
  value: string | Date,
  timeZone: string,
): string {
  return formatInTimeZone(value, timeZone, "dd/MM/yyyy HH:mm");
}