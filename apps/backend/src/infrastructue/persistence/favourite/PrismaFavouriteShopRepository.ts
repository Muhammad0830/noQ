import { FavouriteShop } from "@/domain/favourite/entities/FavouriteShop.js";
import { FavouriteShopRepositoryInterface } from "@/domain/favourite/repositories/FavouriteShopRepositoryInterface.js";
import { FavouriteShopId } from "@/domain/favourite/value-objects/FavouriteShopId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient, FavoriteShop as FavouriteShopModel } from "@prisma/client";

export class PrismaFavouriteShopRepository implements FavouriteShopRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(favouriteShopId: FavouriteShopId): Promise<FavouriteShop> {
        const favouriteShop = await this.prisma.favoriteShop.findUnique({
            where: { id: favouriteShopId.toString() },
        });

        if (!favouriteShop) {
            throw new Error("Favourite Shop not found");
        }

        return this.toEntity(favouriteShop);
    }

    async add(favouriteShop: FavouriteShop): Promise<void> {
        await this.prisma.favoriteShop.create({
            data: {
                id: favouriteShop.getId().toString(),
                shopId: favouriteShop.getShopId().toString(),
                userId: favouriteShop.getUserId().toString(),
                createdAt: favouriteShop.getCreatedAt().getValue(),
                updatedAt: favouriteShop.getUpdatedAt().getValue(),
            }
        })
    }

    nextIdentity(): FavouriteShopId {
        return FavouriteShopId.create();
    }

    private toEntity(model: FavouriteShopModel): FavouriteShop {
        return FavouriteShop.create({
            id: FavouriteShopId.create(model.id),
            userId: UserId.create(model.userId),
            shopId: ShopId.create(model.shopId),
        });
    }
}