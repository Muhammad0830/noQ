import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import { UserId } from "../value-objects/UserId.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";

interface Props {
    id: UserId,
    name: string,
    email: EmailAddress,
    role: UserRole,
    avatarUrl?: string,
    phoneNumber?: string,
    createdAt: DateTime,
    updatedAt: DateTime,
}

interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime,
    updatedAt?: DateTime,
}

export class User {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateProps): User {
        if (!props.name.trim()) {
            throw new Error("User name is required");
        }

        if (!props.id.toString()) {
            throw new Error("User ID is required");
        }

        if (!props.email.isValid()) {
            throw new Error("Invalid User email");
        }

        return new User({
            id: props.id,
            name: props.name,
            email: props.email,
            avatarUrl: props.avatarUrl,
            role: props.role,
            phoneNumber: props.phoneNumber,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): UserId {
        return this.props.id;
    }

    getName(): string {
        return this.props.name;
    }

    getEmail(): EmailAddress {
        return this.props.email;
    }

    getAvatarUrl(): string | null {
        return this.props.avatarUrl ?? null;
    }

    getPhoneNumber(): string | null {
        return this.props.phoneNumber ?? null;
    }

    getRole(): UserRole {
        return this.props.role;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    sameAsOther(other: User): boolean {
        return other.getId().equals(this.props.id);
    }
}