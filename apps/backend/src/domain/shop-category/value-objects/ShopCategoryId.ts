import { v4 as uuidv4 } from "uuid";

export class ShopCategoryId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): ShopCategoryId {
        return new ShopCategoryId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }
}