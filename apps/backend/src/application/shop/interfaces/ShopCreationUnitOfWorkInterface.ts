import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { UserRepositoryInterface } from "@/domain/user/repositories/UserRepositoryInterface.js";

export interface ShopCreationTransaction {
    shopRepository: ShopRepositoryInterface;
    userRepository: UserRepositoryInterface;
    shopScheduleRepository: ShopScheduleRepositoryInterface;
    serviceRepository: ServiceRepositoryInterface;
}

export interface ShopCreationUnitOfWorkInterface {
    execute<T>(
        operation: (transaction: ShopCreationTransaction) => Promise<T>,
    ): Promise<T>
}