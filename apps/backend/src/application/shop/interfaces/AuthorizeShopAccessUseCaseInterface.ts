import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";

export interface AuthorizeShopAccessUseCaseInterface {
    execute(input: AuthorizeShopAccessUseCaseInput): Promise<AuthorizeShopAccessUseCaseOutput>
}

export interface AuthorizeShopAccessUseCaseInput {
    userId: string;
    shopId: string;
}

export interface AuthorizeShopAccessUseCaseOutput {
    position: UserPosition;
}