import type { Money } from "@/domain/shared/value-objects/Money.js";
import type { ServiceId } from "../value-objects/ServiceId.js";
import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

interface ServiceProps {
    id: ServiceId,
    shopId: ShopId,
    name: string,
    price: Money,
    durationMin: number,
    isActive: boolean,
    createdAt: DateTime,
    updatedAt: DateTime,
    bufferTime?: number | null,
    description?: string | null,
}

export class Service {
    constructor(private readonly props: ServiceProps) { }

    static create(service: ServiceProps): Service {
        if (!service.id.toString().trim()) {
            throw new Error("Service ID is required");
        }

        if (!service.shopId.toString().trim()) {
            throw new Error("Shop ID is required");
        }

        if (!service.name.trim()) {
            throw new Error("Service name is required");
        }

        if (service.price.isZero()) {
            throw new Error("Service price is required");
        }

        if (service.durationMin <= 0) {
            throw new Error("Service duration is required");
        }

        return new Service({
            ...service,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
        });
    }

    isValid(): boolean {
        if (
            !this.props.id.toString().trim() ||
            !this.props.shopId.toString().trim() ||
            !this.props.name.trim() ||
            this.props.durationMin <= 0 ||
            this.props.price.isZero()
        ) {
            return false;
        }

        return true;
    }

    sameServiceAs(other: Service): boolean {
        return this.props.id === other.getId();
    }

    getId(): ServiceId {
        return this.props.id;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getName(): string {
        return this.props.name;
    }

    getPrice(): Money {
        return this.props.price;
    }

    getDurationMin(): number {
        return this.props.durationMin;
    }

    getDescription(): string | null {
        return this.props.description || null;
    }

    getBufferTime(): number | null {
        return this.props.bufferTime || null;
    }

    getTotalDurationMin(): number {
        return this.props.durationMin + (this.props.bufferTime ?? 0)
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt
    }

    isActive(): boolean {
        return this.props.isActive;
    }

    activate(): void {
        if (this.isActive()) {
            throw new Error("Service is already active");
        }

        this.props.isActive = true;
        this.touch();
    }

    inactivate(): void {
        if (!this.isActive()) {
            throw new Error("Service is already inactive");
        }

        this.props.isActive = false;
        this.touch();
    }

    private touch(): void {
        this.props.updatedAt = DateTime.now()
    }
}