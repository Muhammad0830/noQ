import { FavouriteServiceRepositoryInterface } from "@/domain/favourite/repositories/FavouriteServiceRepositoryInterface.js";
import { RemoveFromFavouriteServiceUseCaseInput, RemoveFromFavouriteServiceUseCaseInterface } from "../interfaces/RemoveFromFavouriteServiceUseCaseInterface.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export class RemoveFromFavouriteServiceUseCase
    implements RemoveFromFavouriteServiceUseCaseInterface {
    constructor(
        private readonly favouriteServiceRepository: FavouriteServiceRepositoryInterface,
    ) { }

    async execute(input: RemoveFromFavouriteServiceUseCaseInput): Promise<void> {
        const serviceId = ServiceId.create(input.serviceId);
        const userId = UserId.create(input.userId);

        const favouriteService = await this.favouriteServiceRepository.findByServiceIdAndUserId(
            serviceId,
            userId
        );

        if (!favouriteService) {
            throw new Error("Favourite Service not found");
        }

        await this.favouriteServiceRepository.delete(favouriteService.getId());
    }
}