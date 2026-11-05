import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { BookingStatus } from "@noq/shared";

export interface GetBookingDataQueryInterface {
    getCountByTime(input: GetCountByTimeInput): Promise<number>;
    getPriceListByTime(input: GetPriceByTimeInput): Promise<number[]>;
    getRevenueByTime(input: GetRevenueByTimeInput): Promise<GetRevenueByTimeOutput>;
    getFamousServiceList(input: GetFamousServiceListInput): Promise<FamousServiceItem[]>;
    getPeakHourList(input: GetPeakHourListInput): Promise<PeakHourItem[]>;
    getShopHistoryBookingList(input: GetShopHistoryBookingListInput): Promise<GetShopHistoryBookingListOutput>;
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

export interface GetPeakHourListInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
}

export interface PeakHourItem {
    hour: number;
    count: number;
}

export interface GetShopHistoryBookingListInput {
    shopId: ShopId;
    startTime: DateTime;
    endTime: DateTime;
    searchQuery: string | null;
}

export interface GetShopHistoryBookingListOutput {
    bookingList: {
        id: string,
        userId: string,
        shopId: string,
        serviceId: string | null,
        serviceName: string,
        servicePrice: number,
        startTime: Date,
        endTime: Date,
        status: BookingStatus,
        staffId: string | null,
        createdAt: Date,
        updatedAt: Date,
        user: {
            id: string,
            name: string
        },
        staff: {
            id: string,
            name: string,
        } | null
    }[];
}