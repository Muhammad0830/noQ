import { ShopBlockRepositoryInterface } from "@/domain/shop-block/repositories/ShopBlockRepositoryInterface.js";
import { PrismaShopBlockRepository } from "@/infrastructue/persistence/shop-block/PrismaShopBlockRepository.js";

export interface ShopBlockCreationUnitOfWorkInterface {
    execute<T>(
        operation: (transaction: ShopBlockCreationTransaction) => Promise<T>
    ): Promise<T>;
}

export interface ShopBlockCreationTransaction {
    shopBlockRepository: ShopBlockRepositoryInterface,
}