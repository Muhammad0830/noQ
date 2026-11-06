import { ShopAccessQueryInterface } from "@/application/shop/interfaces/ShopAccessQueryInterface.js";
import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient } from "@prisma/client";

export class ShopAccessQuery implements ShopAccessQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findUserRole(userId: UserId, shopId: ShopId): Promise<UserPosition | null> {
        const staff = await this.prisma.staff.findUnique({
            where: {
                userId_shopId: {
                    userId: userId.toString(),
                    shopId: shopId.toString(),
                },
            },
            select: { role: true },
        });

        return staff ? UserPosition.from(staff.role) : null;
    }
}