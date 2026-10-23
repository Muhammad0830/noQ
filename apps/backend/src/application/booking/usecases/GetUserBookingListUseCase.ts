import type { GetUserBookingListInput, GetUserBookingListUseCaseInterface } from "@/application/booking/interfaces/GetBookingListUseCaseInterface.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import type { UserBookingListQueryInterface } from "@/application/booking/read-queries/UserBookingListQueryInterface.js";
import type { UserBookingListDTO } from "@/application/booking/dtos/UserBookingListDTO.js";

export class GetUserBookingListUseCase implements GetUserBookingListUseCaseInterface {
    constructor(
        private readonly getUserBookingListQuery: UserBookingListQueryInterface,
    ) { }

    async execute(input: GetUserBookingListInput): Promise<UserBookingListDTO> {
        const customerId = CustomerId.create(input.customerId);

        const bookingList = await this.getUserBookingListQuery.execute({
            customerId,
            view: input.view,
        });

        return bookingList;
    }
}