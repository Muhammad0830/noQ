import type { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import type { OwnerId } from "../value-objects/OwnerId.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";

interface Props {
    id: OwnerId,
    email: EmailAddress,
    name: string,
    avatarUrl?: string,
    role: UserRole,
    phoneNumber?: string,
    createdAt: Date,
    updatedAt: Date,
}

type CreateProps = Omit<Props, 'createdAt' | 'updatedAt'>;

export class Owner {
    constructor(
        private readonly props: Props
    ) { }

    static create(props: CreateProps): Owner {
        if (!props.id.toString().trim()) {
            throw new Error('Owner ID is required');
        }

        if (!props.email.toString().trim()) {
            throw new Error("Owner email addres is required");
        }

        if (!props.name.trim()) {
            throw new Error("Owner name is required");
        }

        if (props.role !== UserRole.ADMIN) {
            throw new Error("Owner role should be Admin")
        }

        const now = new Date();

        return new Owner({
            ...props,
            createdAt: now,
            updatedAt: now,
        });
    }

    getId(): OwnerId {
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

    getAvatarUrl(): string | null {
        return this.props.avatarUrl ?? null;
    }

    getPhoneNumber(): string | null {
        return this.props.phoneNumber ?? null;
    }

    sameOwnerAs(owner: Owner): boolean {
        return owner.getId() === this.props.id;
    }
}