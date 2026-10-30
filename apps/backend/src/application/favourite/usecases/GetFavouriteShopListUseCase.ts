import { GetFavouriteShopQueryInterface, ShopItem } from "../interfaces/GetFavouriteShopQueryInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export class GetFavouriteShopListUseCase {
    constructor(
        private readonly getFavouriteShopQuery: GetFavouriteShopQueryInterface,
    ) { }

    async execute(id: string): Promise<ShopItem[]> {
        const userId = UserId.create(id);

        const favouriteShopList = await this.getFavouriteShopQuery.getList(userId);

        return favouriteShopList;
    }
}