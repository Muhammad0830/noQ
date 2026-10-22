import { addDays as _addDays, format, parse } from "date-fns";

export function getOneDayAfter(date: string | Date) {
    return addDays(date, 1);
}

export function addDays(date: string | Date, days: number) {
    return _addDays(date, days);
}

export function createDateTime(dateStr: string, timeStr: string): Date {
    return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function formatToDateString(value: Date | string) {
    const date = new Date(value);
    return format(date, 'yyyy-MM-dd');
}