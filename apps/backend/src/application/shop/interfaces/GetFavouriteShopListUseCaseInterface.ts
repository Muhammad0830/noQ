import { FavouriteShopListDTO } from "./GetShopListQueryInterface.js";

export interface GetFavouriteShopListUseCaseInterface {
    execute(userId: string): Promise<FavouriteShopListDTO>;
}