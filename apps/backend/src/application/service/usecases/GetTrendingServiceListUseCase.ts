import { GetServiceDataQueryInterface, GetTrendingServiceListDTO } from "@/domain/service/repositories/GetServiceDataQueryInterface.js";
import { GetTrendingServiceListUseCaseInterface } from "../interfaces/GetTrendingServiceListUseCaseInterface.js";

const TIME_RANGE = 7 * 24 * 60 * 60 * 1000;
const LIMIT = 10;

export class GetTrendingServiceListUseCase implements GetTrendingServiceListUseCaseInterface {
    constructor(
        private readonly getServiceDataQuery: GetServiceDataQueryInterface,
    ) { }

    async execute(): Promise<GetTrendingServiceListDTO> {
        const dto = await this.getServiceDataQuery.getTrending(TIME_RANGE, LIMIT);

        return dto;
    }
}