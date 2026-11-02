import { CreateEmergencyBlockUseCase } from "@/application/shop-block/usecases/CreateEmergencyBlockUseCase.js";
import { GetEmergencyBlockListUseCase } from "@/application/shop-block/usecases/GetEmergencyBlockListUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopBlockController } from "@/http/controllers/ShopBlockController.js";
import { PrismaShopBlockCreationUnitOfWork } from "@/infrastructue/persistence/prisma/PrismaShopBlockCreationUnitOfWork.js";
import { GetEmergencyBlockDataQuery } from "@/infrastructue/persistence/shop-block/GetEmergencyBlockDataQuery.js";
import { PrismaShopBlockRepository } from "@/infrastructue/persistence/shop-block/PrismaShopBlockRepository.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const shopBlockRepository = new PrismaShopBlockRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const shopBlockCreationUnitOfWork = new PrismaShopBlockCreationUnitOfWork(prisma);

const getEmergencyBlockDataQuery = new GetEmergencyBlockDataQuery(prisma);

const getEmergencyBlockListUseCase = new GetEmergencyBlockListUseCase(getEmergencyBlockDataQuery);

const createEmergencyBlockUseCase = new CreateEmergencyBlockUseCase(
    shopBlockCreationUnitOfWork,
    shopRepository,
)

export const shopBlockController = new ShopBlockController(
    getEmergencyBlockListUseCase,
    createEmergencyBlockUseCase,
);