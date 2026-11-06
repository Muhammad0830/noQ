import { CreateStaffUseCase } from "@/application/staff/usecases/CreateStaffUseCase.js";
import { DeleteStaffUseCase } from "@/application/staff/usecases/DeleteStaffUseCase.js";
import { GetStaffListUseCase } from "@/application/staff/usecases/GetStaffListUseCase.js";
import prisma from "@/db/prisma.js";
import { StaffController } from "@/http/controllers/StaffController.js";
import { PrismaShopRepository } from "@/infrastructue/persistence/shop/PrismaShopRepository.js";
import { GetStaffDataQuery } from "@/infrastructue/persistence/staff/GetStaffDataQuery.js";
import { PrismaStaffRepository } from "@/infrastructue/persistence/staff/PrismaStaffRepository.js";
import { PrismaUserRepository } from "@/infrastructue/persistence/user/PrismaUserRepository.js";

const shopRepository = new PrismaShopRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const staffRepository = new PrismaStaffRepository(prisma);

const getStaffDataQuery = new GetStaffDataQuery(prisma);

const getStaffListUseCase = new GetStaffListUseCase(
    shopRepository,
    getStaffDataQuery,
);

const createStaffUseCase = new CreateStaffUseCase(
    shopRepository,
    userRepository,
    staffRepository,
);

const deleteStaffUseCase = new DeleteStaffUseCase(
    staffRepository,
)

export const staffController = new StaffController(
    getStaffListUseCase,
    createStaffUseCase,
    deleteStaffUseCase,
)

