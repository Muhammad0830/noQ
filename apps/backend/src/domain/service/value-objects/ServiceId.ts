import { v4 as uuidv4 } from "uuid";

export class ServiceId {
    constructor(private readonly value: string) { }

    static create(value?: string): ServiceId {
        return new ServiceId(value ?? uuidv4());
    }

    toString() {
        return this.value;
    }
}