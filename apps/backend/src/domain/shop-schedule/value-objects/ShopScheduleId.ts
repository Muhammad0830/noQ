import { v4 as uuiv4 } from "uuid";

export class ShopScheduleId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): ShopScheduleId {
        return new ShopScheduleId(value ?? uuiv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: ShopScheduleId): boolean {
        return this.value === other.toString();
    }
}