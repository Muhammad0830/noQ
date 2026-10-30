import { v4 as uuidv4 } from "uuid";

export class FavouriteServiceId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): FavouriteServiceId {
        return new FavouriteServiceId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: FavouriteServiceId): boolean {
        return this.value === other.toString();
    }
}