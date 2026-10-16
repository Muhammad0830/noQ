export type BookingStatusValue =
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

export class BookingStatus {
    private constructor(
        public readonly value: BookingStatusValue
    ) { }

    static readonly PENDING = new BookingStatus('PENDING');
    static readonly CONFIRMED = new BookingStatus('CONFIRMED');
    static readonly IN_PROGRESS = new BookingStatus('IN_PROGRESS');
    static readonly COMPLETED = new BookingStatus('COMPLETED');
    static readonly CANCELLED = new BookingStatus('CANCELLED');
    static readonly NO_SHOW = new BookingStatus('NO_SHOW');

    static from(value: BookingStatusValue): BookingStatus {
        switch (value) {
            case 'PENDING': return BookingStatus.PENDING;
            case 'CONFIRMED': return BookingStatus.CONFIRMED;
            case 'IN_PROGRESS': return BookingStatus.IN_PROGRESS;
            case 'COMPLETED': return BookingStatus.COMPLETED;
            case 'CANCELLED': return BookingStatus.CANCELLED;
            case 'NO_SHOW': return BookingStatus.NO_SHOW;
        }
    }

    canTransitionTo(next: BookingStatus): boolean {
        const transitions: Record<
            BookingStatusValue,
            BookingStatusValue[]
        > = {
            PENDING: ['CONFIRMED', 'CANCELLED'],
            CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
            IN_PROGRESS: ['COMPLETED'],
            COMPLETED: [],
            CANCELLED: [],
            NO_SHOW: [],
        }

        return transitions[this.value].includes(next.value);
    }

    equals(other: BookingStatus): boolean {
        return this.value === other.value;
    }
}