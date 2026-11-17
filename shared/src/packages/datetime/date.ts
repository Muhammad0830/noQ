import {
    addDays as _addDays,
    format,
    parse,
    subDays as _subDays,
    subMonths as _subMonths,
    addMonths as _addMonths,
    subYears as _subYears,
    addYears as _addYears,
    startOfDay as _startOfDay,
    startOfMonth as _startOfMonth,
    startOfYear as _startOfYear,
} from "date-fns";

export function getOneDayAfter(date: string | Date) {
    return addDays(date, 1);
}

export function addDays(date: string | Date, days: number) {
    return _addDays(date, days);
}

export function addMonths(date: string | Date, days: number) {
    return _addMonths(date, days);
}

export function addYears(date: string | Date, days: number) {
    return _addYears(date, days);
}

export function subDays(date: string | Date, days: number) {
    return _subDays(date, days);
}

export function subMonths(date: string | Date, months: number) {
    return _subMonths(date, months);
}

export function subYears(date: string | Date, years: number) {
    return _subYears(date, years);
}

export function createDateTime(dateStr: string, timeStr: string): Date {
    return parse(`${dateStr} ${timeStr}`, 'yyyy-MM-dd HH:mm', new Date());
}

export function formatToDateString(value: Date | string) {
    const date = new Date(value);
    return format(date, 'yyyy-MM-dd');
}

export function startOfDay(date: Date) {
    return _startOfDay(date);
}

export function startOfMonth(date: Date) {
    return _startOfMonth(date);
}

export function startOfYear(date: Date) {
    return _startOfYear(date);
}