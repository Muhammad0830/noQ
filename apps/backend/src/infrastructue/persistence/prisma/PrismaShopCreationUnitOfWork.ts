import { ShopCreationTransaction, ShopCreationUnitOfWorkInterface } from "@/application/shop/interfaces/ShopCreationUnitOfWorkInterface.js";
import { PrismaClient } from "@prisma/client";
import { PrismaShopRepository } from "../shop/PrismaShopRepository.js";
import { PrismaUserRepository } from "../user/PrismaUserRepository.js";
import { PrismaShopScheduleRepository } from "../shop-schedule/PrismaShopScheduleRepository.js";
import { PrismaServiceRepository } from "../service/PrismaServiceRepository.js";

export class PrismaShopCreationUnitOfWork implements ShopCreationUnitOfWorkInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute<T>(
        operation: (transaction: ShopCreationTransaction) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const transaction: ShopCreationTransaction = {
                shopRepository: new PrismaShopRepository(tx),
                userRepository: new PrismaUserRepository(tx),
                shopScheduleRepository: new PrismaShopScheduleRepository(tx),
                serviceRepository: new PrismaServiceRepository(tx),
            };

            return operation(transaction);
        });
    }
}