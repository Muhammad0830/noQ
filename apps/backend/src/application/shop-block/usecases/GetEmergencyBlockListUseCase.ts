import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetEmergencyBlockListUseCaseInterface } from "../interfaces/GetEmergencyBlockListUseCaseInterface.js";
import { EmergencyBlockDTO, GetEmergencyBlockListQueryInterface } from "../interfaces/GetEmergencyBlockListQueryInterface.js";

export class GetEmergencyBlockListUseCase implements GetEmergencyBlockListUseCaseInterface {
    constructor(
        private readonly getEmergencyBlockListQuery: GetEmergencyBlockListQueryInterface,
    ) { }

    async execute(id: string): Promise<EmergencyBlockDTO> {
        const shopId = ShopId.create(id);

        return await this.getEmergencyBlockListQuery.getListByShopId(shopId);
    }
}