export type UserRoleValue =
    | "USER"
    | "ADMIN"

export class UserRole {
    constructor(
        private readonly value: UserRoleValue,
    ) { }

    static readonly USER = new UserRole('USER');
    static readonly ADMIN = new UserRole('ADMIN');

    static from(value: UserRoleValue): UserRole {
        return new UserRole(value);
    }

    getValue(): UserRoleValue {
        return this.value;
    }

    canBecomeAdmin(): boolean {
        return true; // TODO: implement logic behind creating new shop policy (e.g. people who did not pay enough cannot)
    }

    equals(role: UserRole): boolean {
        return role.value === this.value;
    }
}