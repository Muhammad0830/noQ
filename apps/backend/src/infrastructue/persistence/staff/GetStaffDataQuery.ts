import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetStaffDataQueryInterface, StaffItem } from "@/application/staff/interfaces/GetStaffDataQueryInterface.js";
import { PrismaClient } from "@prisma/client";
import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";

export class GetStaffDataQuery implements GetStaffDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getCountByShopId(shopId: ShopId): Promise<number> {
        return await this.prisma.staff.count({
            where: { shopId: shopId.toString() },
        })
    }

    async getListByShopId(shopId: ShopId): Promise<StaffItem[]> {
        const staffList = await this.prisma.staff.findMany({
            where: { shopId: shopId.toString() },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        role: true,
                        phoneNumber: true,
                    },
                },
            },
        });

        return staffList.map(staff => ({
            id: staff.id,
            userId: staff.userId,
            shopId: staff.shopId,
            position: UserPosition.from(staff.role),
            createdAt: staff.createdAt,
            updatedAt: staff.updatedAt,
            user: {
                id: staff.user.id,
                name: staff.user.name,
                email: staff.user.email,
                phoneNumber: staff.user.phoneNumber,
                avatarUrl: staff.user.avatarUrl,
                role: staff.user.role,
            }
        }))
    }
}