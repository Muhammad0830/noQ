import { GetShopHistoryBookingListOutput } from "./GetBookingDataQueryInterface.js";

export interface GetShopHistoryBookingListUseCaseInterface {
    execute(input: GetShopHistoryBookingListUseCaseInput): Promise<GetShopHistoryBookingListOutput>;
}

export interface GetShopHistoryBookingListUseCaseInput {
    shopId: string;
    startTime: string;
    endTime: string;
    searchQuery: string | null;
}