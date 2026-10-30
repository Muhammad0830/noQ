import { FavouriteService } from "../entities/FavouriteService.js";
import { FavouriteServiceId } from "../value-objects/FavouriteServiceId.js";

export interface FavouriteServiceRepositoryInterface {
    findById(favouriteServiceId: FavouriteServiceId): Promise<FavouriteService>;

    add(favouriteService: FavouriteService): Promise<void>;

    nextIdentity(): FavouriteServiceId;
}