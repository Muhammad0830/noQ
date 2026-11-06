import { CheckEmailExistsUseCase } from "@/application/auth/usecases/CheckEmailExistsUseCase.js";
import { FindUserUseCase } from "@/application/auth/usecases/FindUserUseCase.js";
import prisma from "@/db/prisma.js";
import { AuthController } from "@/http/controllers/AuthController.js";
import { GetUserDataQuery } from "@/infrastructue/persistence/user/GetUserDataQuery.js";
import { PrismaUserRepository } from "@/infrastructue/persistence/user/PrismaUserRepository.js";

const userRepository = new PrismaUserRepository(prisma);
const getUserDataQuery = new GetUserDataQuery(prisma);

const checkEmailExistsUseCase = new CheckEmailExistsUseCase(userRepository);
const findUserUseCase = new FindUserUseCase(getUserDataQuery);

export const authController = new AuthController(
    checkEmailExistsUseCase,
    findUserUseCase,
)