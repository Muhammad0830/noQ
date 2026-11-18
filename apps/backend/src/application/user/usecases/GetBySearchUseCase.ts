import { GetByEmailOutput, GetUserDataQueryInterface } from "@/application/auth/interfaces/GetUserDataQueryInterface.js";
import { GetBySearchUseCaseInterface } from "../interfaces/GetBySearchUseCaseInterface.js";

export class GetBySearchUseCase implements GetBySearchUseCaseInterface {
    constructor(
        private getUserDataQuery: GetUserDataQueryInterface,
    ) { }

    async execute(search: string): Promise<GetByEmailOutput> {
        return this.getUserDataQuery.getByEmail(search);
    }
}