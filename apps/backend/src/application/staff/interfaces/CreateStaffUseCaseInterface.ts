import { UserPositionType } from "@noq/shared";

export interface CreateStaffUseCaseInterface {
    execute(input: CreateStaffUseCaseInput): Promise<void>;
}

export interface CreateStaffUseCaseInput {
    userId: string;
    shopId: string;
    position: UserPositionType;
}