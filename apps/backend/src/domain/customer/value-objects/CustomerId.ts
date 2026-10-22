import { v4 as uuidv4 } from "uuid";

export class CustomerId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): CustomerId {
        return new CustomerId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: CustomerId): boolean {
        return this.value === other.toString();
    }
}