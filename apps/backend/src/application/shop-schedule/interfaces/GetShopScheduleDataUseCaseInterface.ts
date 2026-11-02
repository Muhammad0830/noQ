import { ShopScheduleDTO } from "./ShopScheduleUpdateUnitOfWorkInterface.js";

export interface GetShopScheduleDataUseCaseInterface {
    execute(id: string): Promise<ShopScheduleDTO>;
}