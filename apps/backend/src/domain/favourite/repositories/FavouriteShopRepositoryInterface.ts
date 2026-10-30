import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { FavouriteShop } from "../entities/FavouriteShop.js";
import { FavouriteShopId } from "../value-objects/FavouriteShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface FavouriteShopRepositoryInterface {
    findById(favouriteShopId: FavouriteShopId): Promise<FavouriteShop>;

    findByShopIdAndUserId(shopId: ShopId, userId: UserId): Promise<FavouriteShop | null>;

    add(favouriteShop: FavouriteShop): Promise<void>;

    delete(favouriteShopId: FavouriteShopId): Promise<void>;

    nextIdentity(): FavouriteShopId;
}