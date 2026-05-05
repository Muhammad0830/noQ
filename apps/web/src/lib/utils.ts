import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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
