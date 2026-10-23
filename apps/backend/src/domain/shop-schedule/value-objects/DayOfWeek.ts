import type { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { DayOfWeekEnum } from "@noq/shared";

export class DayOfWeek {
    private constructor(private readonly value: DayOfWeekEnum) { }

    static from(value: number): DayOfWeek {
        if (!Number.isInteger(value) || value < 0 || value > 6) {
            throw new Error(`Invalid DayOfWeek: ${value}. Must be an integer between 0 and 6.`);
        }

        return new DayOfWeek(value as DayOfWeekEnum);
    }

    static fromDate(date: DateTime): DayOfWeek {
        return DayOfWeek.from(date.getDay());
    }

    getValue(): DayOfWeekEnum {
        return this.value;
    }

    isWeekend(): boolean {
        return this.value === DayOfWeekEnum.SUNDAY || this.value === DayOfWeekEnum.SATURDAY;
    }

    isWeekday(): boolean {
        return !this.isWeekend();
    }

    getName(): string {
        const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return names[this.value];
    }

    equals(other: DayOfWeek): boolean {
        return this.value === other.getValue();
    }

    toJSON(): number {
        return this.value;
    }
}