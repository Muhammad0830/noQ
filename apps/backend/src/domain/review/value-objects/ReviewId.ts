import { v4 as uuidv4 } from "uuid";

export class ReviewId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): ReviewId {
        return new ReviewId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }

    equals(other: ReviewId): boolean {
        return other.toString() === this.value;
    }
}