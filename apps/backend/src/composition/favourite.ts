import { GetFavouriteServiceListUseCase } from "@/application/favourite/usecases/GetFavouriteServiceListUseCase.js";
import { GetFavouriteShopListUseCase } from "@/application/favourite/usecases/GetFavouriteShopListUseCase.js";
import prisma from "@/db/prisma.js";
import { FavouriteController } from "@/http/controllers/FavouriteController.js";
import { GetFavouriteServiceQuery } from "@/infrastructue/persistence/favourite/GetFavouriteServiceQuery.js";
import { GetFavouriteShopQuery } from "@/infrastructue/persistence/favourite/GetFavouriteShopQuery.js";
import { PrismaFavouriteServiceRepository } from "@/infrastructue/persistence/favourite/PrismaFavouriteServiceRepository.js";
import { PrismaFavouriteShopRepository } from "@/infrastructue/persistence/favourite/PrismaFavouriteShopRepository.js";

const favouriteShopQuery = new PrismaFavouriteShopRepository(prisma);
const favouriteServiceQuery = new PrismaFavouriteServiceRepository(prisma);

const getFavouriteServiceQuery = new GetFavouriteServiceQuery(prisma);
const getFavouriteShopQuery = new GetFavouriteShopQuery(prisma);

const getFavouriteShopListUseCase = new GetFavouriteShopListUseCase(getFavouriteShopQuery);
const getFavouriteServiceListUseCase = new GetFavouriteServiceListUseCase(getFavouriteServiceQuery);

export const favouriteController = new FavouriteController(
    getFavouriteShopListUseCase,
    getFavouriteServiceListUseCase
)