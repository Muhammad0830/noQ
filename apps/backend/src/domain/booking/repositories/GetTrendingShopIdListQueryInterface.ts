import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetTrendingShopIdListQueryOutput {
    shopIdList: ShopId[];
}

export interface GetTrendingShopIdListQueryInterface {
    execute(): Promise<GetTrendingShopIdListQueryOutput>
}