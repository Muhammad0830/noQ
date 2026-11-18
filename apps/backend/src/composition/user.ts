import { StorageService } from "@/application/shared/services/StorageService.js";
import { GetBySearchUseCase } from "@/application/user/usecases/GetBySearchUseCase.js";
import { UpdateUserAvatarUseCase } from "@/application/user/usecases/UpdateUserAvatarUseCase.js";
import { UpdateUserUseCase } from "@/application/user/usecases/UpdateUserUseCase.js";
import prisma from "@/db/prisma.js";
import { UserController } from "@/http/controllers/UserController.js";
import { GetUserDataQuery } from "@/infrastructue/persistence/user/GetUserDataQuery.js";
import { PrismaUserRepository } from "@/infrastructue/persistence/user/PrismaUserRepository.js";

const storageService = new StorageService();

const getUserDataQuery = new GetUserDataQuery(prisma);

const userRepository = new PrismaUserRepository(prisma);

const updateUserUseCase = new UpdateUserUseCase(userRepository);

const updateUserAvatarUseCase = new UpdateUserAvatarUseCase(
    userRepository,
    storageService,
);

const getBySearchUseCase = new GetBySearchUseCase(
    getUserDataQuery,
)

export const userController = new UserController(
    updateUserUseCase,
    updateUserAvatarUseCase,
    getBySearchUseCase,
)