import { v4 as uuidv4 } from "uuid";

export class StaffId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): StaffId {
        return new StaffId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: StaffId): boolean {
        return other.toString() === this.value;
    }
}