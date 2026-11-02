import { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";

export interface ShopScheduleUpdateUnitOfWorkInterface {
    execute<T>(
        callback: (transaction: ShopScheduleUpdateTransaction) => Promise<T>
    ): Promise<T>;
}

export interface ShopScheduleUpdateTransaction {
    shopScheduleRepository: ShopScheduleRepositoryInterface;
}