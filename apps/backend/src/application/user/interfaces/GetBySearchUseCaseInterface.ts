import { GetByEmailOutput } from "@/application/auth/interfaces/GetUserDataQueryInterface.js";

export interface GetBySearchUseCaseInterface {
    execute(search: string): Promise<GetByEmailOutput>
}

