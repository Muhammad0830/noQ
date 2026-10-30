import { GetReviewDataQueryInterface, ReviewDetails } from "@/application/review/interfaces/GetReviewDataQueryInterface.js";
import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { PrismaClient } from "@prisma/client";

export class GetReviewDataQuery implements GetReviewDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(id: ReviewId): Promise<ReviewDetails> {
        const review = await this.prisma.review.findUnique({
            where: { id: id.toString() },
            include: {
                user: true,
                service: true,
                shop: {
                    include: { category: true }
                },
            }
        });

        if (!review) {
            throw new Error("Review not found");
        }

        return {
            id: review.id,
            userId: review.userId,
            shopId: review.shopId,
            serviceId: review.serviceId,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            user: {
                id: review.user.id,
                name: review.user.name,
                avatarUrl: review.user.avatarUrl,
            },
            service: review.service ? {
                id: review.service.id,
                shopId: review.service.shopId,
                name: review.service.name,
                description: review.service.description,
                price: Number(review.service.price),
                durationMin: review.service.durationMin,
                bufferTime: review.service.bufferTime,
                isActive: review.service.isActive,
                createdAt: review.service.createdAt,
                updatedAt: review.service.updatedAt,
            } : null,
            shop: review.shop ? {
                id: review.shop.id,
                categoryId: review.shop.categoryId,
                ownerId: review.shop.ownerId,
                name: review.shop.name,
                address: review.shop.address,
                phoneNumber: review.shop.phone,
                timezone: review.shop.timezone,
                isOpen: review.shop.isOpen,
                description: review.shop.description,
                backgroundImageUrl: review.shop.backgroundImageUrl,
                logoUrl: review.shop.logoUrl,
                createdAt: review.shop.createdAt,
                updatedAt: review.shop.updatedAt,
                category: review.shop.category
            } : null,
        }
    }
}