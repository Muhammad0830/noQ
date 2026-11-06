import { GetStaffListUseCase } from "@/application/staff/usecases/GetStaffListUseCase.js";
import prisma from "@/db/prisma.js";
import { StaffController } from "@/http/controllers/StaffController.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { GetStaffDataQuery } from "@/infrastructue/persistence/staff/GetStaffDataQuery.js";

const shopRepository = new PrismaShopRepository(prisma);

const getStaffDataQuery = new GetStaffDataQuery(prisma);

const getStaffListUseCase = new GetStaffListUseCase(
    shopRepository,
    getStaffDataQuery,
);

export const staffController = new StaffController(
    getStaffListUseCase,
)

