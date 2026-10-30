import { FavouriteServiceId } from "@/domain/favourite/value-objects/FavouriteServiceId.js";
import { AddToFavouriteServiceUseCaseInput, AddToFavouriteServiceUseCaseInterface } from "../interfaces/AddToFavouriteServiceUseCase.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { FavouriteService } from "@/domain/favourite/entities/FavouriteService.js";
import { FavouriteServiceRepositoryInterface } from "@/domain/favourite/repositories/FavouriteServiceRepositoryInterface.js";

export class AddToFavouriteServiceUseCase implements AddToFavouriteServiceUseCaseInterface {
    constructor(
        private readonly favouriteServiceRepository: FavouriteServiceRepositoryInterface,
    ) { }

    async execute(input: AddToFavouriteServiceUseCaseInput): Promise<FavouriteServiceId> {
        const userId = UserId.create(input.userId);
        const serviceId = ServiceId.create(input.serviceId);

        const existingFavouriteService = await this.favouriteServiceRepository.findByServiceIdAndUserId(
            serviceId,
            userId
        );

        if (existingFavouriteService) {
            throw new Error("The service already in Favourites");
        }

        const favouriteServiceId = this.favouriteServiceRepository.nextIdentity();

        const favouriteService = FavouriteService.create({
            id: favouriteServiceId,
            userId: userId,
            serviceId: serviceId,
        });

        await this.favouriteServiceRepository.add(favouriteService);
        return favouriteServiceId;
    }
}