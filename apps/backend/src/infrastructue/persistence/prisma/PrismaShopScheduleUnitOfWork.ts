import { ShopScheduleUpdateTransaction, ShopScheduleUpdateUnitOfWorkInterface } from "@/application/shop-schedule/interfaces/ShopScheduleUpdateUnitOfWorkInterface.js";
import { PrismaClient } from "@prisma/client";
import { PrismaShopScheduleRepository } from "../shop-schedule/PrismaShopScheduleRepository.js";

export class PrismaShopScheduleUnitOfWork implements ShopScheduleUpdateUnitOfWorkInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute<T>(
        operation: (transaction: ShopScheduleUpdateTransaction) => Promise<T>
    ): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            const transaction: ShopScheduleUpdateTransaction = {
                shopScheduleRepository: new PrismaShopScheduleRepository(tx),
            };

            return operation(transaction);
        });
    }
}