import { UserId } from "@/domain/user/value-objects/UserId.js";
import { AuthorizeShopAccessUseCaseInput, AuthorizeShopAccessUseCaseInterface, AuthorizeShopAccessUseCaseOutput } from "../interfaces/AuthorizeShopAccessUseCaseInterface.js";
import { ShopAccessQueryInterface } from "../interfaces/ShopAccessQueryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export class AuthorizeShopAccessUseCase implements AuthorizeShopAccessUseCaseInterface {
    constructor(
        private readonly shopAccessQuery: ShopAccessQueryInterface,
    ) { }

    async execute(input: AuthorizeShopAccessUseCaseInput): Promise<AuthorizeShopAccessUseCaseOutput> {
        const userId = UserId.create(input.userId);
        const shopId = ShopId.create(input.shopId);

        const position = await this.shopAccessQuery.findUserRole(
            userId,
            shopId,
        );

        if (!position) {
            throw new Error("Forbidden, Invalid Shop Id Or UserId");
        }

        return {
            position: position,
        }
    }
}