import { GetShopDataUseCase } from "@/application/shop/usecases/GetShopDataUseCase.js";
import { GetShopListUseCase } from "@/application/shop/usecases/GetShopListUseCase.js";
import { GetTrendingShopListUseCase } from "@/application/shop/usecases/GetTrendingShopListUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopController } from "@/http/controllers/ShopController.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { GetShopDataQuery } from "@/infrastructue/persistence/shop/GetShopDataQuery.js";
import { GetShopListQuery } from "@/infrastructue/persistence/shop/GetShopListQuery.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const shopRepository = new PrismaShopRepository(prisma);
const serviceRepository = new PrismaServiceRepository(prisma);

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
)

export const shopController = new ShopController(
    getShopListUseCase,
    getShopDataUseCase,
    getTrendingShopListUseCase,
);
