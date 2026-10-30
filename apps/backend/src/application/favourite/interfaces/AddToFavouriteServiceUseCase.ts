import { FavouriteServiceId } from "@/domain/favourite/value-objects/FavouriteServiceId.js";

export interface AddToFavouriteServiceUseCaseInterface {
    execute(input: AddToFavouriteServiceUseCaseInput): Promise<FavouriteServiceId>;
}

export interface AddToFavouriteServiceUseCaseInput {
    userId: string;
    serviceId: string;
}