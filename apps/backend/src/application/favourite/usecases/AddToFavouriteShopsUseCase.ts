import {
    AddToFavouriteShopsUseCaseInput,
    AddToFavouriteShopsUseCaseInterface
} from "@/application/favourite/interfaces/AddToFavouriteShopsUseCaseInterface.js";
import { FavouriteShopId } from "@/domain/favourite/value-objects/FavouriteShopId.js";
import { PrismaFavouriteShopRepository } from "@/infrastructue/persistence/favourite/PrismaFavouriteShopRepository.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { FavouriteShop } from "@/domain/favourite/entities/FavouriteShop.js";

export class AddToFavouriteShopsUseCase implements AddToFavouriteShopsUseCaseInterface {
    constructor(
        private readonly favouriteShopRepository: PrismaFavouriteShopRepository,
    ) { }

    async execute(input: AddToFavouriteShopsUseCaseInput): Promise<FavouriteShopId> {
        const userId = UserId.create(input.userId);
        const shopId = ShopId.create(input.shopId);

        const existingFavouriteShop = await this.favouriteShopRepository.findByShopIdAndUserId(
            shopId,
            userId
        );
        

        if (existingFavouriteShop) {
            throw new Error("The shop already in Favourites");
        }

        const favouriteShopId = this.favouriteShopRepository.nextIdentity();

        const favouriteShop = FavouriteShop.create({
            id: favouriteShopId,
            userId: userId,
            shopId: shopId,
        });

        await this.favouriteShopRepository.add(favouriteShop);
        return favouriteShopId;
    }
}