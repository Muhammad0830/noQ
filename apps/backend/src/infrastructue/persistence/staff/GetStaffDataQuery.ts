import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetStaffDataQueryInterface } from "@/domain/staff/repositories/GetStaffDataQueryInterface.js";
import { PrismaClient } from "@prisma/client";

export class GetStaffDataQuery implements GetStaffDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getCountByShopId(shopId: ShopId): Promise<number> {
        return await this.prisma.staff.count({
            where: { shopId: shopId.toString() },
        })
    }
}