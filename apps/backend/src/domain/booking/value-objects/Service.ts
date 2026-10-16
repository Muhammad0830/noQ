import type { Money } from "@/domain/shared/value-objects/Money.js";


export interface ServiceProps {
    id: string;
    name: string;
    unitPrice: Money;
    durationMinutes: number;
}

export class Service {
    private constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly unitPrice: Money,
        public readonly durationMinutes: number,
    ) { }

    static create(props: ServiceProps): Service {
        if (!props.id.trim()) {
            throw new Error("Service ID is required");
        }

        if (!props.name.trim()) {
            throw new Error("Service name is required");
        }

        if (props.unitPrice.amount < 0) {
            throw new Error("Unit price cannot be negative");
        }

        if (
            !Number.isSafeInteger(props.durationMinutes) ||
            props.durationMinutes <= 0
        ) {
            throw new Error("Duration must be a positive integer");
        }

        return new Service(
            props.id,
            props.name.trim(),
            props.unitPrice,
            props.durationMinutes,
        );
    }

    sameServiceAs(other: Service): boolean {
        return this.id === other.id;
    }

    isValid(): boolean {
        if (
            !this.id.trim() ||
            !this.name.trim() ||
            this.durationMinutes <= 0 ||
            this.unitPrice.amount <= 0
        ) {
            return false;
        }

        return true;
    }
}
