import { ShopBlockRepositoryInterface } from "@/domain/shop-block/repositories/ShopBlockRepositoryInterface.js";

export interface ShopBlockCreationUnitOfWorkInterface {
    execute<T>(
        operation: (transaction: ShopBlockCreationTransaction) => Promise<T>
    ): Promise<T>;
}

export interface ShopBlockCreationTransaction {
    shopBlockRepository: ShopBlockRepositoryInterface,
}