import type {
    GetUserBookingListInput,
    GetUserBookingListUseCaseInterface
} from "@/application/booking/interfaces/GetBookingListUseCaseInterface.js";
import type { UserBookingListDTO } from
    "@/application/booking/dtos/UserBookingListDTO.js";
import { GetBookingDataQueryInterface } from
    "../interfaces/GetBookingDataQueryInterface.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";

export class GetUserBookingListUseCase implements GetUserBookingListUseCaseInterface {
    constructor(
        private readonly getBookingDataQuery: GetBookingDataQueryInterface,
    ) { }

    async execute(input: GetUserBookingListInput): Promise<UserBookingListDTO> {
        const customerId = CustomerId.create(input.customerId);

        const bookingList = await this.getBookingDataQuery.getListByUserId({
            customerId,
            view: input.view,
        });

        return bookingList;
    }
}