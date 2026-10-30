import { FavouriteShop } from "../entities/FavouriteShop.js";
import { FavouriteShopId } from "../value-objects/FavouriteShopId.js";

export interface FavouriteShopRepositoryInterface {
    findById(favouriteShopId: FavouriteShopId): Promise<FavouriteShop>;

    add(favouriteShop: FavouriteShop): Promise<void>;

    nextIdentity(): FavouriteShopId;
}