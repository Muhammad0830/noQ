import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import { UserId } from "../value-objects/UserId.js";
import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";

interface Props {
    id: UserId,
    name: string,
    email: EmailAddress,
    role: UserRole,
    avatarUrl: string | null,
    phoneNumber: string | null,
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

    isAdmin(): boolean {
        return this.props.role.equals(UserRole.ADMIN);
    }

    isUser(): boolean {
        return this.props.role.equals(UserRole.USER);
    }

    sameAsOther(other: User): boolean {
        return other.getId().equals(this.props.id);
    }

    updateName(name: string): void {
        this.props.name = name;
        this.touch();
    }

    updateAvatarUrl(url: string): void {
        this.props.avatarUrl = url;
        this.touch();
    }

    updatePhoneNumber(phoneNumber: string): void {
        this.props.phoneNumber = phoneNumber;
        this.touch();
    }

    updateRole(role: UserRole): void {
        if (role.equals(UserRole.ADMIN)) {
            this.ensureCanBecomeAdmin();
        }

        this.props.role = role;
    }

    private ensureCanBecomeAdmin(): void {
        if (this.isAdmin()) {
            throw new Error("User already Admin");
        }
    }

    private touch(): void {
        this.props.updatedAt = DateTime.now();
    }
}