import { ServiceItem } from "./GetFavouriteServiceQueryInterface.js";

export interface GetFavouriteServiceListUseCaseInterface {
    execute(userId: string): Promise<ServiceItem[]>;
}