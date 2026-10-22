import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import type { CustomerId } from "../value-objects/CustomerId.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";

interface Props {
    id: CustomerId,
    name: string,
    email: EmailAddress,
    role: UserRole,
    createdAt: Date,
    updatedAt: Date,
    avatarUrl?: string,
    phoneNumber?: string,
}

interface CreateCustomerProps {
    id: CustomerId,
    name: string,
    email: EmailAddress,
    role: UserRole,
    avatarUrl?: string,
    phoneNumber?: string,
}

export class Customer {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateCustomerProps): Customer {
        if (!props.id.toString().trim()) {
            throw new Error("Customer ID is required");
        }

        if (!props.name.trim()) {
            throw new Error("Customer name is required");
        }

        if (!props.email.isValid()) {
            throw new Error("Invalid Phone Number")
        }

        if (props.role.equals(UserRole.USER)) {
            throw new Error("Invalid Role");
        }

        const now = new Date();

        return new Customer({
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    getId(): CustomerId {
        return this.props.id;
    }

    getName(): string {
        return this.props.name;
    }

    getEmail(): EmailAddress {
        return this.props.email;
    }

    getRole(): UserRole {
        return this.props.role;
    }

    getPhoneNumber(): string | null {
        return this.props.phoneNumber || null;
    }

    getAvatarUrl(): string | null {
        return this.props.avatarUrl || null;
    }

    private touch(): void {
        this.props.updatedAt = new Date();
    }
}