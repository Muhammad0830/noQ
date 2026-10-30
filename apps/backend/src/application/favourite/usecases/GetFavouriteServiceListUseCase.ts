import { UserId } from "@/domain/user/value-objects/UserId.js";
import { GetFavouriteServiceQueryInterface, ServiceItem } from "../interfaces/GetFavouriteServiceQueryInterface.js";
import { GetFavouriteServiceListUseCaseInterface } from "../interfaces/GetFavouriteServiceListUseCaseInterface.js";

export class GetFavouriteServiceListUseCase implements GetFavouriteServiceListUseCaseInterface {
    constructor(
        private readonly getFavouriteServiceQuery: GetFavouriteServiceQueryInterface,
    ) { }

    async execute(id: string): Promise<ServiceItem[]> {
        const userId = UserId.create(id);

        const favouriteServiceList = await this.getFavouriteServiceQuery.getList(userId);

        return favouriteServiceList;
    }
}