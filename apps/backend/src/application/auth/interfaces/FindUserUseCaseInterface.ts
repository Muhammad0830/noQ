import { UserItem } from "./GetUserDataQueryInterface.js";

export interface FindUserUseCaseInterface {
    execute(userId: string): Promise<UserItem>;
}