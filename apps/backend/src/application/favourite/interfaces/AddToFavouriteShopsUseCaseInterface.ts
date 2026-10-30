import { FavouriteShopId } from "@/domain/favourite/value-objects/FavouriteShopId.js";

export interface AddToFavouriteShopsUseCaseInterface {
    execute(input: AddToFavouriteShopsUseCaseInput): Promise<FavouriteShopId>
}

export interface AddToFavouriteShopsUseCaseInput {
    userId: string;
    shopId: string;
}