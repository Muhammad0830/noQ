import { BookingStatus } from "@noq/shared"

export { cn } from "cn"

export function formatPrice(
  value: number | string | null | undefined,
  locale = "uz-UZ",
) {
  if (value === null || value === undefined || value === "") {
    return "0"
  }

  const numericValue = typeof value === "number" ? value : Number(value)

  if (!Number.isFinite(numericValue)) {
    return String(value)
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
    .format(numericValue)
    .replace(/[\u00A0\u202F]/g, " ")
}

export function getInitials(name?: string | null) {
  if (!name) {
    return '';
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function canTransitionTo(thisStatus: BookingStatus, changeTo: BookingStatus): boolean {
  const transitions: Record<
    BookingStatus,
    BookingStatus[]
  > = {
    PENDING: [
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED
    ],
    CONFIRMED: [
      BookingStatus.IN_PROGRESS,
      BookingStatus.CANCELLED,
      BookingStatus.NO_SHOW
    ],
    IN_PROGRESS: [BookingStatus.COMPLETED],
    COMPLETED: [],
    CANCELLED: [],
    NO_SHOW: [],
  }

  return transitions[thisStatus].includes(changeTo);
}

export const monthNames: string[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
]

export const weekdayShort: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
