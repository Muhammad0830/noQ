import { BookingStatus as BookingStatusEnum } from "@noq/shared";

export class BookingStatus {
    private constructor(
        private readonly value: BookingStatusEnum
    ) { }

    static readonly PENDING = new BookingStatus(BookingStatusEnum.PENDING);
    static readonly CONFIRMED = new BookingStatus(BookingStatusEnum.CONFIRMED);
    static readonly IN_PROGRESS = new BookingStatus(BookingStatusEnum.IN_PROGRESS);
    static readonly COMPLETED = new BookingStatus(BookingStatusEnum.COMPLETED);
    static readonly CANCELLED = new BookingStatus(BookingStatusEnum.CANCELLED);
    static readonly NO_SHOW = new BookingStatus(BookingStatusEnum.NO_SHOW);

    static from(value: BookingStatusEnum | string): BookingStatus {
        switch (value) {
            case 'PENDING': return BookingStatus.PENDING;
            case 'CONFIRMED': return BookingStatus.CONFIRMED;
            case 'IN_PROGRESS': return BookingStatus.IN_PROGRESS;
            case 'COMPLETED': return BookingStatus.COMPLETED;
            case 'CANCELLED': return BookingStatus.CANCELLED;
            case 'NO_SHOW': return BookingStatus.NO_SHOW;
        }
        throw new Error("Invalid Booking Status");
    }

    getValue(): BookingStatusEnum {
        return this.value;
    }

    canTransitionTo(next: BookingStatus): boolean {
        const transitions: Record<
            BookingStatusEnum,
            BookingStatusEnum[]
        > = {
            PENDING: [
                BookingStatusEnum.CONFIRMED,
                BookingStatusEnum.CANCELLED
            ],
            CONFIRMED: [
                BookingStatusEnum.IN_PROGRESS,
                BookingStatusEnum.CANCELLED,
                BookingStatusEnum.NO_SHOW
            ],
            IN_PROGRESS: [BookingStatusEnum.COMPLETED],
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