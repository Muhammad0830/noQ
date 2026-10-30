import { GetTrendingServiceListDTO } from "@/application/service/interfaces/GetServiceDataQueryInterface.js";

export interface GetTrendingServiceListUseCaseInterface {
    execute(): Promise<GetTrendingServiceListDTO>
}