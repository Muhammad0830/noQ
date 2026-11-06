import { GetStaffDataQueryInterface, StaffItem } from "@/application/staff/interfaces/GetStaffDataQueryInterface.js";
import { GetStaffListUseCaseInterface } from "../interfaces/GetStaffListUseCaseInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";

export class GetStaffListUseCase implements GetStaffListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly getStaffDataQuery: GetStaffDataQueryInterface,
    ) { }

    async execute(id: string): Promise<StaffItem[]> {
        const shopId = ShopId.create(id);

        await this.shopRepository.ensureExists(shopId);

        return await this.getStaffDataQuery.getListByShopId(shopId);
    }
}