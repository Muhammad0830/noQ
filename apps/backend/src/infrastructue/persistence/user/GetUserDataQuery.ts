import { GetUserDataQueryInterface, UserItem } from "@/application/auth/interfaces/GetUserDataQueryInterface.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient } from "@prisma/client";

export class GetUserDataQuery implements GetUserDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findUserById(userId: UserId): Promise<UserItem> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId.toString() },
            include: {
                shops: {
                    select: {
                        id: true,
                        name: true,
                        category: true,
                    },
                },
            },
        });

        if (!user) {
            throw new Error("User not found");
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            shops: user.shops.map(shop => ({
                id: shop.id,
                name: shop.name,
                category: {
                    id: shop.category.id,
                    name: shop.category.name,
                    icon: shop.category.icon,
                }
            }))
        };
    }
}