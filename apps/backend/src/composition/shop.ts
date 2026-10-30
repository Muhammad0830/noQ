import { StorageService } from "@/application/shared/services/StorageService.js";
import { CreateShopUseCase } from "@/application/shop/usecases/CreateShopUseCase.js";
import { GetFavouriteShopListUseCase } from "@/application/shop/usecases/GetFavouriteShopListUseCase.js";
import { GetShopDataUseCase } from "@/application/shop/usecases/GetShopDataUseCase.js";
import { GetShopListUseCase } from "@/application/shop/usecases/GetShopListUseCase.js";
import { GetTrendingShopListUseCase } from "@/application/shop/usecases/GetTrendingShopListUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopController } from "@/http/controllers/ShopController.js";
import { PrismaShopCreationUnitOfWork } from "@/infrastructue/persistence/prisma/PrismaShopCreationUnitOfWork.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { PrismaShopCategoryRepository } from "@/infrastructue/persistence/shop-category/PrismaShopCategoryRepository.js";
import { PrismaShopScheduleRepository } from "@/infrastructue/persistence/shop-schedule/PrismaShopScheduleRepository.js";
import { GetShopDataQuery } from "@/infrastructue/persistence/shop/GetShopDataQuery.js";
import { GetShopListQuery } from "@/infrastructue/persistence/shop/GetShopListQuery.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { PrismaUserRepository } from "@/infrastructue/persistence/user/PrismaUserRepository.js";

const shopRepository = new PrismaShopRepository(prisma);
const serviceRepository = new PrismaServiceRepository(prisma);
const categoryRepository = new PrismaShopCategoryRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const shopScheduleRepository = new PrismaShopScheduleRepository(prisma);

const storageService = new StorageService();

const shopCreationUnitOfWork = new PrismaShopCreationUnitOfWork(prisma);

const getShopDataQuery = new GetShopDataQuery(prisma);
const getShopListQuery = new GetShopListQuery(prisma);

const getShopListUseCase = new GetShopListUseCase(
    getShopListQuery,
    serviceRepository
);

const getShopDataUseCase = new GetShopDataUseCase(
    getShopDataQuery
);

const getTrendingShopListUseCase = new GetTrendingShopListUseCase(
    getShopListQuery,
);

const createShopUseCase = new CreateShopUseCase(
    shopRepository,
    categoryRepository,
    userRepository,
    shopScheduleRepository,
    serviceRepository,
    storageService,
    shopCreationUnitOfWork,
);

const getFavouriteShopListUseCase = new GetFavouriteShopListUseCase(getShopListQuery);

export const shopController = new ShopController(
    getShopListUseCase,
    getShopDataUseCase,
    getTrendingShopListUseCase,
    createShopUseCase,
    getFavouriteShopListUseCase,
);
