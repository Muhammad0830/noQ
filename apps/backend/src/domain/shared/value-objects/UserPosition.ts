import { UserPositionType } from "@noq/shared";

export class UserPosition {
    constructor(
        private readonly value: UserPositionType,
    ) { }

    static readonly STAFF = new UserPosition("STAFF");
    static readonly MANAGER = new UserPosition("MANAGER");
    static readonly OWNER = new UserPosition("OWNER");

    static from(value: UserPositionType): UserPosition {
        return new UserPosition(value);
    }

    getValue(): UserPositionType {
        return this.value;
    }

    equals(other: UserPosition): boolean {
        return other.getValue() === this.value;
    }
}