import { GetShopDataQueryOutput } from "./GetShopDataQueryInterface.js";

export interface GetShopDataUseCaseInterface {
    execute(id: string): Promise<GetShopDataQueryOutput>;
}