import { AddToFavouriteServiceUseCase } from
    "@/application/favourite/usecases/AddToFavouriteServiceUseCase.js";
import { AddToFavouriteShopsUseCase } from
    "@/application/favourite/usecases/AddToFavouriteShopsUseCase.js";
import { GetFavouriteServiceListUseCase } from
    "@/application/favourite/usecases/GetFavouriteServiceListUseCase.js";
import { GetFavouriteShopListUseCase } from
    "@/application/favourite/usecases/GetFavouriteShopListUseCase.js";
import { RemoveFromFavouriteServiceUseCase } from
    "@/application/favourite/usecases/RemoveFromFavouriteServiceUseCase.js";
import { RemoveFromFavouriteShopUseCase } from
    "@/application/favourite/usecases/RemoveFromFavouriteShopUseCase.js";
import { FavouriteController } from
    "@/http/controllers/FavouriteController.js";
import { GetFavouriteServiceQuery } from
    "@/infrastructue/persistence/favourite/GetFavouriteServiceQuery.js";
import { GetFavouriteShopQuery } from
    "@/infrastructue/persistence/favourite/GetFavouriteShopQuery.js";
import { PrismaFavouriteServiceRepository } from
    "@/infrastructue/persistence/favourite/PrismaFavouriteServiceRepository.js";
import { PrismaFavouriteShopRepository } from
    "@/infrastructue/persistence/favourite/PrismaFavouriteShopRepository.js";
import prisma from "@/db/prisma.js";

const favouriteShopRepository = new PrismaFavouriteShopRepository(prisma);
const favouriteServiceRepository = new PrismaFavouriteServiceRepository(prisma);

const getFavouriteServiceQuery = new GetFavouriteServiceQuery(prisma);
const getFavouriteShopQuery = new GetFavouriteShopQuery(prisma);

const getFavouriteShopListUseCase = new GetFavouriteShopListUseCase(getFavouriteShopQuery);
const getFavouriteServiceListUseCase = new GetFavouriteServiceListUseCase(getFavouriteServiceQuery);
const addToFavouriteServiceUseCase = new AddToFavouriteServiceUseCase(favouriteServiceRepository);
const addToFavouriteShopUseCase = new AddToFavouriteShopsUseCase(favouriteShopRepository);
const removeFromFavouriteShopUseCase = new RemoveFromFavouriteShopUseCase(favouriteShopRepository);
const removeFromFavouriteServiceUseCase = new RemoveFromFavouriteServiceUseCase(favouriteServiceRepository);

export const favouriteController = new FavouriteController(
    getFavouriteShopListUseCase,
    addToFavouriteShopUseCase,
    removeFromFavouriteShopUseCase,
    getFavouriteServiceListUseCase,
    addToFavouriteServiceUseCase,
    removeFromFavouriteServiceUseCase,
)