import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetStaffDataQueryInterface {
    getCountByShopId(shopId: ShopId): Promise<number>;
}