import { addMinutes as addMinutesDateFns, differenceInMinutes, parse, parseISO, startOfDay } from 'date-fns';

export const timeToMinutes = (time: string): number => {
    const date = parse(time, "HH:mm", new Date(0));
    return differenceInMinutes(date, startOfDay(date));
};

export function addMinutes(isoString: string, minutes: number): Date {
    return addMinutesDateFns(new Date(isoString), minutes);
}