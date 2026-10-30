import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { FavouriteService } from "../entities/FavouriteService.js";
import { FavouriteServiceId } from "../value-objects/FavouriteServiceId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface FavouriteServiceRepositoryInterface {
    findById(favouriteServiceId: FavouriteServiceId): Promise<FavouriteService>;

    findByServiceIdAndUserId(serviceId: ServiceId, userId: UserId): Promise<FavouriteService | null>;

    add(favouriteService: FavouriteService): Promise<void>;

    delete(favouriteServiceId: FavouriteServiceId): Promise<void>;

    nextIdentity(): FavouriteServiceId;
}