import { ShopItem } from "./GetFavouriteShopQueryInterface.js";

export interface GetFavouriteShopListUseCaseInterface {
    execute(userId: string): Promise<ShopItem[]>
}