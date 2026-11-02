import { v4 as uuidv4 } from "uuid";

export class ShopBlockId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): ShopBlockId {
        return new ShopBlockId(value ?? uuidv4())
    }

    toString(): string {
        return this.value;
    }

    equals(other: ShopBlockId): boolean {
        return this.value === other.toString();
    }
}