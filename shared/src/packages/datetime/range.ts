import { fromZonedTime } from "date-fns-tz";

export function getUtcDayRange(
  date: string,
  timezone: string,
) {
  const [year, month, day] = date.split("-").map(Number);

  const current = new Date(Date.UTC(year, month - 1, day));

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    current.getUTCFullYear() !== year ||
    current.getUTCMonth() !== month - 1 ||
    current.getUTCDate() !== day
  ) {
    throw new Error("Invalid date. Expected YYYY-MM-DD.");
  }

  const next = new Date(Date.UTC(year, month - 1, day + 1));

  const nextDate = [
    next.getUTCFullYear(),
    String(next.getUTCMonth() + 1).padStart(2, "0"),
    String(next.getUTCDate()).padStart(2, "0"),
  ].join("-");

  return {
    startUtc: fromZonedTime(`${date}T00:00:00`, timezone),
    endUtc: fromZonedTime(`${nextDate}T00:00:00`, timezone),
  };
}