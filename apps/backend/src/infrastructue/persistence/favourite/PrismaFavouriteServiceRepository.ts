import { FavouriteService } from "@/domain/favourite/entities/FavouriteService.js";
import { FavouriteServiceRepositoryInterface } from "@/domain/favourite/repositories/FavouriteServiceRepositoryInterface.js";
import { FavouriteServiceId } from "@/domain/favourite/value-objects/FavouriteServiceId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient, FavoriteService as FavouriteServiceModel } from "@prisma/client";

export class PrismaFavouriteServiceRepository implements FavouriteServiceRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(favouriteServiceId: FavouriteServiceId): Promise<FavouriteService> {
        const favouriteService = await this.prisma.favoriteService.findUnique({
            where: { id: favouriteServiceId.toString() },
        });

        if (!favouriteService) {
            throw new Error("Favourite Service not found");
        }

        return this.toEntity(favouriteService);
    }

    async add(favouriteService: FavouriteService): Promise<void> {
        await this.prisma.favoriteService.create({
            data: {
                id: favouriteService.getId().toString(),
                serviceId: favouriteService.getServiceId().toString(),
                userId: favouriteService.getUserId().toString(),
                createdAt: favouriteService.getCreatedAt().getValue(),
                updatedAt: favouriteService.getUpdatedAt().getValue(),
            }
        })
    }

    nextIdentity(): FavouriteServiceId {
        return FavouriteServiceId.create();
    }

    private toEntity(model: FavouriteServiceModel): FavouriteService {
        return FavouriteService.create({
            id: FavouriteServiceId.create(model.id),
            userId: UserId.create(model.userId),
            serviceId: ServiceId.create(model.serviceId),
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
        });
    }
}