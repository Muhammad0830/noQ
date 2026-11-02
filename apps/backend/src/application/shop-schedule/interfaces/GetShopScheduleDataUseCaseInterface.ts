import { ShopScheduleDTO } from "./GetShopScheduleDataQueryInterface.js";

export interface GetShopScheduleDataUseCaseInterface {
    execute(id: string): Promise<ShopScheduleDTO>;
}