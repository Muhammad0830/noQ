import { UserId } from "@/domain/user/value-objects/UserId.js";
import { FavouriteShopListDTO, GetShopListQueryInterface } from "../interfaces/GetShopListQueryInterface.js";

export class GetFavouriteShopListUseCase {
    constructor(
        private readonly getShopListQuery: GetShopListQueryInterface,
    ) { }

    async execute(id: string): Promise<FavouriteShopListDTO> {
        const userId = UserId.create(id);

        const dto = await this.getShopListQuery.getFavouriteList(userId);

        return dto;
    }
}