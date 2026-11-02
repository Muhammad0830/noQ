import { UpdateShopScheduleUseCase } from "@/application/schedule/usecases/UpdateShopScheduleUseCase.js";
import prisma from "@/db/prisma.js";
import { ShopScheduleController } from "@/http/controllers/ShopScheduleController.js";
import { PrismaShopScheduleUnitOfWork } from "@/infrastructue/persistence/prisma/PrismaShopScheduleUnitOfWork.js";
import { PrismaShopScheduleRepository } from "@/infrastructue/persistence/shop-schedule/PrismaShopScheduleRepository.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";

const shopScheduleRepository = new PrismaShopScheduleRepository(prisma);
const shopRepository = new PrismaShopRepository(prisma);

const updateShopScheduleUnitOfWork = new PrismaShopScheduleUnitOfWork(prisma);

const updateShopScheduleUseCase = new UpdateShopScheduleUseCase(
    shopScheduleRepository,
    shopRepository,
    updateShopScheduleUnitOfWork,
);

export const shopScheduleController = new ShopScheduleController(
    updateShopScheduleUseCase,
);