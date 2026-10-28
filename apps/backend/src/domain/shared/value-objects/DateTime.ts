import { addMinutes as _addMinutes, addDays, createDateTime, formatToDateString, formatToTimeString } from "@noq/shared";

export class DateTime {
    constructor(
        private readonly value: Date,
    ) { }

    static from(value: string | Date | number): DateTime {
        const date = value instanceof Date ? new Date(value.getTime()) : new Date(value);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`Invalid DateTime input: ${value}`);
        }

        return new DateTime(date);
    }

    static fromDateAndTime(date: string, time: string): DateTime {
        const newDate = createDateTime(date, time);

        if (Number.isNaN(newDate.getTime())) {
            throw new Error(`Invalid DateTime input. date: ${date}, time: ${time}`);
        }

        return new DateTime(newDate);
    }

    static now(): DateTime {
        return new DateTime(new Date());
    }

    getValue(): Date {
        return new Date(this.value.getTime());
    }

    getTime(): number {
        return this.value.getTime();
    }

    getDifference(other: DateTime): number {
        return this.getTime() - other.getTime();
    }

    getDay(): number {
        return this.getValue().getDay();
    }

    greaterThan(other: DateTime): boolean {
        return this.value.getTime() > other.getValue().getTime();
    }

    lessThan(other: DateTime): boolean {
        return this.value.getTime() < other.getValue().getTime();
    }

    equals(other: DateTime): boolean {
        return this.value.getTime() === other.getValue().getTime();
    }

    isFuture(): boolean {
        return this.greaterThan(DateTime.now());
    }

    isPast(): boolean {
        return this.lessThan(DateTime.now());
    }

    addMinutes(minutes: number): DateTime {
        const newDate = _addMinutes(this.value, minutes);
        return new DateTime(newDate);
    }

    addDays(days: number): DateTime {
        const newDate = addDays(this.value, days);
        return new DateTime(newDate);
    }

    toTimeString(): string {
        return formatToTimeString(this.value);
    }

    toDateString(): string {
        return formatToDateString(this.value);
    }

    toISOString(): string {
        return this.value.toISOString()
    }

    toJSON(): string {
        return this.toISOString();
    }
}