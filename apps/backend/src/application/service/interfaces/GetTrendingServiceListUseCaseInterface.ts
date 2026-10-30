import { GetTrendingServiceListDTO } from "@/domain/service/repositories/GetServiceDataQueryInterface.js";

export interface GetTrendingServiceListUseCaseInterface {
    execute(): Promise<GetTrendingServiceListDTO>
}