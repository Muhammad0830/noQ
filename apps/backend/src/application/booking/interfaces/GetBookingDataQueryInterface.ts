import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetBookingDataQueryInterface {
    getCountByTime(input: GetCountByTimeInput): Promise<number>;
    getPriceListByTime(input: GetPriceByTimeInput): Promise<number[]>;
    getRevenueByTime(input: GetRevenueByTimeInput): Promise<GetRevenueByTimeOutput>;
    getFamousServiceList(input: GetFamousServiceListInput): Promise<FamousServiceItem[]>;
}

export interface GetCountByTimeInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
}

export interface GetPriceByTimeInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
}

export interface GetRevenueByTimeInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
}

export interface GetRevenueByTimeOutput {
    bookings: GetRevenueByTimeItem[];
}

export interface GetRevenueByTimeItem {
    startTime: DateTime;
    servicePrice: number;
}

export interface GetFamousServiceListInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
}

export interface FamousServiceItem {
    id: string;
    name: string;
    bookingCount: number;
}