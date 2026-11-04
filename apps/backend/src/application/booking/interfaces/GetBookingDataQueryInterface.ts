import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetBookingDataQueryInterface {
    getCountByTime(input: GetCountByTimeInput): Promise<number>;
    getPriceListByTime(input: GetPriceByTimeInput): Promise<number[]>;
}

export interface GetCountByTimeInput {
    shopId: ShopId,
    startTime: DateTime,
    endTime: DateTime,
}

export interface GetPriceByTimeInput {
    shopId: ShopId,
    startTime: DateTime,
    endTime: DateTime,
}