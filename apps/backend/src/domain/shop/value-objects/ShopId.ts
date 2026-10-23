import { v4 as uuidv4 } from "uuid";

export class ShopId {
    constructor(private readonly value: string) { }

    static create(value?: string): ShopId {
        return new ShopId(value ?? uuidv4())
    }

    toString(): string {
        return this.value;
    }

    equals(other: ShopId): boolean {
        return this.value === other.toString();
    }
}