import { GetEmergencyBlockListUseCase } from "@/application/shop-block/usecases/GetEmergencyBlockListUseCase.js";
import { GetShopScheduleDataUseCase } from "@/application/shop-schedule/usecases/GetShopScheduleDataUseCase.js";
import { UpdateShopScheduleUseCase } from "@/application/shop-schedule/usecases/UpdateShopScheduleUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopScheduleController } from "@/http/controllers/ShopScheduleController.js";
import { PrismaShopScheduleUnitOfWork } from "@/infrastructue/persistence/prisma/PrismaShopScheduleUnitOfWork.js";
import { GetEmergencyBlockDataQuery } from "@/infrastructue/persistence/shop-block/GetEmergencyBlockDataQuery.js";
import { GetShopScheduleDataQuery } from "@/infrastructue/persistence/shop-schedule/GetShopScheduleDataQuery.js";
import { PrismaShopScheduleRepository } from "@/infrastructue/persistence/shop-schedule/PrismaShopScheduleRepository.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const shopScheduleRepository = new PrismaShopScheduleRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const getShopScheduleDataQuery = new GetShopScheduleDataQuery(prisma);
const getEmergencyBlockDataQuery = new GetEmergencyBlockDataQuery(prisma)

const updateShopScheduleUnitOfWork = new PrismaShopScheduleUnitOfWork(prisma);

const updateShopScheduleUseCase = new UpdateShopScheduleUseCase(
    shopScheduleRepository,
    shopRepository,
    updateShopScheduleUnitOfWork,
);

const getShopScheduleDataUseCase = new GetShopScheduleDataUseCase(
    getShopScheduleDataQuery,
    shopRepository,
);

const getEmergencyBlockListUseCase = new GetEmergencyBlockListUseCase(
    getEmergencyBlockDataQuery,
);

export const shopScheduleController = new ShopScheduleController(
    updateShopScheduleUseCase,
    getShopScheduleDataUseCase,
    getEmergencyBlockListUseCase,
);