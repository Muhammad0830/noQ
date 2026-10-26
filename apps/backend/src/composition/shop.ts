import { GetShopDataUseCase } from "@/application/shop/usecases/GetShopDataUseCase.js";
import { GetShopListUseCase } from "@/application/shop/usecases/GetShopListUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopController } from "@/http/controllers/ShopController.js";
import { PrismaServiceRepository } from "@/infrastructue/persistence/service/PrismaServiceRepository.js";
import { GetShopDataQuery } from "@/infrastructue/persistence/shop/GetShopDataQuery.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";


const shopRepository = new PrismaShopRepository(prisma);
const serviceRepository = new PrismaServiceRepository(prisma);

const getShopDataQuery = new GetShopDataQuery(prisma);

const getShopListUseCase = new GetShopListUseCase(
    shopRepository,
    serviceRepository
);

const getShopDataUseCase = new GetShopDataUseCase(
    getShopDataQuery
)

export const shopController = new ShopController(
    getShopListUseCase,
    getShopDataUseCase,
);
