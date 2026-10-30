import { v4 as uuidv4 } from "uuid";

export class FavouriteShopId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): FavouriteShopId {
        return new FavouriteShopId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: FavouriteShopId): boolean {
        return this.value === other.toString();
    }
}