import { v4 as uuidv4 } from "uuid";

export class OwnerId {
    constructor(
        private readonly value: string,
    ) { }

    static create(value?: string): OwnerId {
        return new OwnerId(value ?? uuidv4());
    }

    toString(): string {
        return this.value;
    }
}