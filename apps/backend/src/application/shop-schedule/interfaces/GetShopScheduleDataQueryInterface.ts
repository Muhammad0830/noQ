import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ShopScheduleDTO } from "./ShopScheduleUpdateUnitOfWorkInterface.js";

export interface GetShopScheduleDataQueryInterface {
    getWeekly(shopId: ShopId): Promise<ShopScheduleDTO>;
}