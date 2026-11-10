import {
    GetUserDataQueryInterface,
    UserItem
} from "../interfaces/GetUserDataQueryInterface.js";
import { FindUserUseCaseInterface } from
    "../interfaces/FindUserUseCaseInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export class FindUserUseCase implements FindUserUseCaseInterface {
    constructor(
        private readonly getUserDataQuery: GetUserDataQueryInterface,
    ) { }

    async execute(id: string): Promise<UserItem> {
        const userId = UserId.create(id);

        return await this.getUserDataQuery.findUserById(userId);
    }
}