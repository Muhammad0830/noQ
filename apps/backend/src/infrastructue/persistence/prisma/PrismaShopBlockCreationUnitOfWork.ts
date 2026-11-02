import { ShopBlockCreationTransaction } from "@/application/shop-block/interfaces/ShopBlockCreationUnitOfWorkInterface.js";
import { PrismaClient } from "@prisma/client";
import { PrismaShopBlockRepository } from "../shop-block/PrismaShopBlockRepository.js";

export class PrismaShopBlockCreationUnitOfWork {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute<T>(
        operation: (transaction: ShopBlockCreationTransaction) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const transaction: ShopBlockCreationTransaction = {
                shopBlockRepository: new PrismaShopBlockRepository(tx)
            };

            return operation(transaction);
        });
    }
}