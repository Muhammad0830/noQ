import { GetShopDataQueryInterface, GetShopDataQueryOutput } from "@/application/shop/interfaces/GetShopDataQueryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { toZonedTime } from "@noq/shared";
import { PrismaClient } from "@prisma/client";

export class GetShopDataQuery implements GetShopDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute(id: ShopId): Promise<GetShopDataQueryOutput> {
        const now = new Date();

        const [shop, reviewStats] = await Promise.all([
            this.prisma.shop.findUnique({
                where: { id: id.toString() },
                include: {
                    services: {
                        where: {
                            isActive: true,
                        },
                        include: {
                            _count: {
                                select: {
                                    reviews: true,
                                },
                            },
                        },
                    },
                    category: true,
                    staffs: {
                        select: {
                            user: true,
                        }
                    },
                    reviews: {
                        include: {
                            user: true,
                        }
                    },
                    shopSchedules: {
                        where: {
                            type: "OPEN",
                        }
                    }
                },
            }),
            this.prisma.review.aggregate({
                where: { shopId: id.toString() },
                _avg: { rating: true },
                _count: { id: true },
            })
        ]);

        if (!shop) {
            throw new Error("Shop not found");
        }

        const shopDate = toZonedTime(now, shop?.timezone);
        const today = shopDate.getDay();

        const todaySchedule = shop.shopSchedules.find(schedule => schedule.dayOfWeek === today);

        return {
            id: shop.id,
            category: shop.category,
            ownerId: shop.ownerId,
            name: shop.name,
            description: shop.description,
            phoneNumber: shop.phone,
            address: shop.address,
            isOpen: shop.isOpen,
            backgroundImageUrl: shop.backgroundImageUrl,
            createdAt: shop.createdAt,
            updatedAt: shop.updatedAt,
            averageRating: reviewStats._avg.rating ?? 0,
            reviewCount: reviewStats._count.id,
            openTime: todaySchedule?.startTime ?? null,
            closeTime: todaySchedule?.endTime ?? null,
            staffs: shop.staffs.map(staff => ({
                id: staff.user.id,
                name: staff.user.name,
                email: staff.user.email,
                role: staff.user.role,
                createdAt: staff.user.createdAt,
                updatedAt: staff.user.updatedAt,
                avatarUrl: staff.user.avatarUrl,
                phoneNumber: staff.user.phoneNumber,
            })),
            services: shop.services.map(service => ({
                id: service.id,
                shopId: service.shopId,
                name: service.name,
                description: service.description,
                price: Number(service.price),
                durationMin: service.durationMin,
                isActive: service.isActive,
                bufferTime: service.bufferTime,
                reviewCount: service._count.reviews,
                createdAt: service.createdAt,
                updatedAt: service.updatedAt,
            })),
            reviews: shop.reviews.map(review => ({
                id: review.id,
                rating: review.rating,
                userId: review.userId,
                shopId: review.shopId,
                serviceId: review.serviceId,
                comment: review.comment,
                createdAt: review.createdAt,
                updatedAt: review.updatedAt,
                user: review.user,
            })),
        }
    }
}