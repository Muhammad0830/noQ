import { BookingStatus } from "../value-objects/BookingStatus.js";
import type { BookingId } from "../value-objects/BookingId.js";
import type { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import type { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { Money } from "@/domain/shared/value-objects/Money.js";

export interface Props {
    id: BookingId;
    customerId: CustomerId;
    serviceId: ServiceId | null,
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
    status: BookingStatus;
    serviceName: string;
    servicePrice: Money;
    createdAt: DateTime;
    updatedAt: DateTime;
    cancellationReason: string | null;
    cancelledAt: DateTime | null;
}

export interface CreateBookingProps extends Omit<Props, 'createdAt' | 'updatedAt' | 'status'> {
    createdAt?: DateTime;
    updatedAt?: DateTime;
    status?: BookingStatus;
}

export class Booking {
    private constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateBookingProps): Booking {
        if (!props.id.toString().trim()) {
            throw new Error("Booking ID is required");
        }

        if (!props.customerId.toString().trim()) {
            throw new Error("Customer ID is required");
        }

        if (!props.shopId.toString().trim()) {
            throw new Error("Shop ID is required");
        }

        return new Booking({
            ...props,
            status: props.status ?? BookingStatus.PENDING,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): BookingId {
        return this.props.id;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getServiceId(): ServiceId | null {
        return this.props.serviceId;
    }

    getCustomerId(): CustomerId {
        return this.props.customerId;
    }

    getStatus(): BookingStatus {
        return this.props.status;
    }

    getStartTime(): DateTime {
        return this.props.startTime;
    }

    getEndTime(): DateTime {
        return this.props.endTime;
    }

    getServiceName(): string {
        return this.props.serviceName;
    }

    getServicePrice(): Money {
        return this.props.servicePrice;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    getCancelledAt(): DateTime | null {
        return this.props.cancelledAt;
    }

    getCancellationReason(): string | null {
        return this.props.cancellationReason;
    }

    reschedule(newStartTime: DateTime): void {
        this.ensureEditable();

        if (newStartTime.isPast() || newStartTime.equals(DateTime.now())) {
            throw new Error("New booking time must be in the future");
        }

        this.props.startTime = newStartTime;
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
        this.props.cancelledAt = DateTime.now();
        this.touch();
    }

    hasCancellationReason(): boolean {
        return !!this.props.cancellationReason?.trim();
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
                `Cannot transition booking from ${this.props.status.getValue()
                } to ${next.getValue()}`,
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
        this.props.updatedAt = DateTime.now();
    }
}
