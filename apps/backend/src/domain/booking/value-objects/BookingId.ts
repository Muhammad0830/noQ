import { v4 as uuidv4 } from 'uuid';

export class BookingId {
    constructor(private readonly value: string) { }

    static create(value?: string): BookingId {
        return new BookingId(value ?? uuidv4())
    }

    toString(): string {
        return this.value;
    }

    equals(other: BookingId): boolean {
        return this.value === other.toString(); 
    }
}