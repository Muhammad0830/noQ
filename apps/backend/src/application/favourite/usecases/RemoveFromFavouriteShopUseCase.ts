import { FavouriteShopRepositoryInterface } from "@/domain/favourite/repositories/FavouriteShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { RemoveFromFavouriteShopUseCaseInput, RemoveFromFavouriteShopUseCaseInterface } from "../interfaces/RemoveFromFavouriteShopUseCaseInterface.js";

export class RemoveFromFavouriteShopUseCase
    implements RemoveFromFavouriteShopUseCaseInterface {
    constructor(
        private readonly favouriteShopRepository: FavouriteShopRepositoryInterface,
    ) { }

    async execute(input: RemoveFromFavouriteShopUseCaseInput): Promise<void> {
        const shopId = ShopId.create(input.shopId);
        const userId = UserId.create(input.userId);

        const favouriteShop = await this.favouriteShopRepository.findByShopIdAndUserId(
            shopId,
            userId
        );

        if (!favouriteShop) {
            throw new Error("Favourite Shop not found");
        }

        await this.favouriteShopRepository.delete(favouriteShop.getId());
    }
}