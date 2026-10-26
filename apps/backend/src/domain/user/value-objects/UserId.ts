import { v4 as uuidv4 } from "uuid";

export class UserId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): UserId {
        return new UserId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: UserId): boolean {
        return this.value === other.toString();
    }
}