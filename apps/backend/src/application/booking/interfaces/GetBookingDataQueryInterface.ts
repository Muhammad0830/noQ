import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { BookingStatus as BookingStatusEnum } from "@noq/shared";
import { BookingListView } from "../dtos/UserBookingListDTO.js";
import { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";

export interface GetBookingDataQueryInterface {
    getBookedSlotList(input: GetBookedSlotListByDateQueryInput): Promise<TimeSlot[]>;
    getListByUserId(input: GetListByUserIdInput): Promise<GetListByUserIdOutput>;
    checkAvailability(input: BookingAvailabilityCheckerInput): Promise<boolean>;
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

export interface BookingAvailabilityCheckerInput {
    shopId: ShopId,
    endTime: DateTime,
    startTime: DateTime,
}

export interface GetListByUserIdInput {
    customerId: CustomerId;
    view: BookingListView;
}

export interface GetListByUserIdOutput {
    bookings: {
        id: string,
        shopId: string,
        serviceId: string | null,
        customerId: string,
        serviceName: string,
        servicePrice: number,
        startTime: Date,
        endTime: Date,
        status: BookingStatus,
        createdAt: Date,
        shop: {
            id: string;
            name: string;
            address?: string | null;
            backgroundImageUrl?: string | null;
        },
        service: {
            id: string;
            name: string;
            price: number;
            durationMin: number;
        } | null,
    }[];
}

export interface GetBookedSlotListByDateQueryInput {
    shopId: ShopId,
    startTime: DateTime,
    endTime: DateTime,
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
        status: BookingStatusEnum,
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