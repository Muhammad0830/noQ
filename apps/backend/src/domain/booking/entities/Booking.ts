import { BookingStatus } from "../value-objects/BookingStatus.js";
import { Service } from "../value-objects/Service.js";

export interface BookingProps {
    id: string;
    customerId: string;
    shopId: string;
    service: Service;
    scheduledAt: Date;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
    cancellationReason?: string;
    cancelledAt?: Date;
}

export interface CreateBookingProps {
    id: string;
    customerId: string;
    shopId: string;
    service: Service;
    scheduledAt: Date;
}

export class Booking {
    private constructor(
        private readonly props: BookingProps,
    ) { }

    static create(props: CreateBookingProps): Booking {
        if (!props.id.trim()) {
            throw new Error("Booking ID is required");
        }

        if (!props.customerId.trim()) {
            throw new Error("Customer ID is required");
        }

        if (!props.shopId.trim()) {
            throw new Error("Shop ID is required");
        }

        if (!props.service.isValid()) {
            throw new Error("A booking must contain at least one item");
        }

        if (
            Number.isNaN(props.scheduledAt.getTime()) ||
            props.scheduledAt.getTime() <= Date.now()
        ) {
            throw new Error("Booking time must be in the future");
        }

        const now = new Date();

        return new Booking({
            ...props,
            service: props.service,
            status: BookingStatus.PENDING,
            createdAt: now,
            updatedAt: now,
        });
    }

    getId(): string {
        return this.props.id;
    }

    getCustomerId(): string {
        return this.props.customerId;
    }

    getShopId(): string {
        return this.props.shopId;
    }

    getStatus(): BookingStatus {
        return this.props.status;
    }

    getScheduledAt(): Date {
        return new Date(this.props.scheduledAt);
    }

    getCreatedAt(): Date {
        return new Date(this.props.createdAt);
    }

    getUpdatedAt(): Date {
        return new Date(this.props.updatedAt);
    }

    getCancelledAt(): Date | undefined {
        return this.props.cancelledAt
            ? new Date(this.props.cancelledAt)
            : undefined;
    }

    getCancellationReason(): string | undefined {
        return this.props.cancellationReason;
    }

    getService(): Service {
        return this.props.service;
    }

    getDuration(): number {
        return this.props.service.durationMinutes;
    }

    reschedule(newScheduledAt: Date): void {
        this.ensureEditable();

        if (
            Number.isNaN(newScheduledAt.getTime()) ||
            newScheduledAt.getTime() <= Date.now()
        ) {
            throw new Error("New booking time must be in the future");
        }

        this.props.scheduledAt = new Date(newScheduledAt);
        this.touch();
    }

    confirm(): void {
        this.transitionTo(BookingStatus.CONFIRMED);
    }

    start(): void {
        this.transitionTo(BookingStatus.IN_PROGRESS);
    }

    complete(): void {
        this.transitionTo(BookingStatus.COMPLETED);
    }

    markNoShow(): void {
        this.transitionTo(BookingStatus.NO_SHOW);
    }

    cancel(reason: string): void {
        if (!reason.trim()) {
            throw new Error("Cancellation reason is required");
        }

        this.transitionTo(BookingStatus.CANCELLED);
        this.props.cancellationReason = reason.trim();
        this.props.cancelledAt = new Date();
        this.touch();
    }

    isEditable(): boolean {
        return this.props.status.equals(BookingStatus.PENDING);
    }

    isCancelled(): boolean {
        return this.props.status.equals(BookingStatus.CANCELLED);
    }

    isCompleted(): boolean {
        return this.props.status.equals(BookingStatus.COMPLETED);
    }

    private transitionTo(next: BookingStatus): void {
        if (!this.props.status.canTransitionTo(next)) {
            throw new Error(
                `Cannot transition booking from ${this.props.status.value
                } to ${next.value}`,
            );
        }

        this.props.status = next;
        this.touch();
    }

    private ensureEditable(): void {
        if (!this.isEditable()) {
            throw new Error(
                "Only pending bookings can be modified",
            );
        }
    }

    private touch(): void {
        this.props.updatedAt = new Date();
    }
}
