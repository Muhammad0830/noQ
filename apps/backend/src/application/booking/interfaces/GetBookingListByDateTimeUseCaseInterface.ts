import { GetListByDateTimeOutput } from "./GetBookingDataQueryInterface.js";

export interface GetBookingListByDateTimeUseCaseInterface {
    execute(input: GetBookingListByDateTimeUseCaseInput): Promise<GetListByDateTimeOutput>
}

export interface GetBookingListByDateTimeUseCaseInput {
    shopId: string;
    startTime: string;
}