import { Review } from "@/domain/review/entities/Review.js";
import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { PrismaClient, Review as ReviewModel } from "@prisma/client";
import { ReviewRepositoryInterface } from
    "@/domain/review/repositories/ReviewRepositoryInterface.js";

export class PrismaReviewRepository implements ReviewRepositoryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(reviewId: ReviewId): Promise<Review> {
        const review = await this.prisma.review.findUnique({
            where: { id: reviewId.toString() },
        });

        if (!review) {
            throw new Error("Review not found");
        }

        return this.toEntity(review);
    }

    async getAll(): Promise<Review[]> {
        const reviewList = await this.prisma.review.findMany();

        return reviewList.map(review => this.toEntity(review));
    }

    async getByReviewId(reviewIdList: ReviewId[]): Promise<Review[]> {
        const reviewList = await this.prisma.review.findMany({
            where: {
                id: { in: reviewIdList.map(id => id.toString()) },
            },
        });

        return reviewList.map(review => this.toEntity(review));
    }

    async getByUserId(userId: UserId): Promise<Review[]> {
        const reviewList = await this.prisma.review.findMany({
            where: { userId: userId.toString() },
        });

        return reviewList.map(review => this.toEntity(review));
    }

    async getByShopId(shopId: ShopId): Promise<Review[]> {
        const reviewList = await this.prisma.review.findMany({
            where: { shopId: shopId.toString() },
        });

        return reviewList.map(review => this.toEntity(review));
    }

    async getByServiceId(serviceId: ServiceId): Promise<Review[]> {
        const reviewList = await this.prisma.review.findMany({
            where: { serviceId: serviceId.toString() },
        });

        return reviewList.map(review => this.toEntity(review));
    }

    async add(review: Review): Promise<void> {
        await this.prisma.review.create({
            data: {
                id: review.getId().toString(),
                userId: review.getUserId().toString(),
                shopId: review.getShopId()?.toString(),
                serviceId: review.getServiceId()?.toString(),
                rating: review.getRating(),
                comment: review.getComment(),
                createdAt: review.getCreatedAt().getValue(),
                updatedAt: review.getUpdatedAt().getValue(),
            }
        })
    }

    async save(review: Review): Promise<void> {
        await this.prisma.review.update({
            where: { id: review.getId().toString() },
            data: {
                id: review.getId().toString(),
                userId: review.getUserId().toString(),
                shopId: review.getShopId()?.toString(),
                serviceId: review.getServiceId()?.toString(),
                rating: review.getRating(),
                comment: review.getComment(),
                createdAt: review.getCreatedAt().getValue(),
                updatedAt: review.getUpdatedAt().getValue(),
            }
        })
    }

    nextIdentity(): ReviewId {
        return ReviewId.create();
    }

    private toEntity(model: ReviewModel): Review {
        return Review.create({
            id: ReviewId.create(model.id),
            userId: UserId.create(model.userId),
            shopId: model.shopId ? ShopId.create(model.shopId) : null,
            serviceId: model.serviceId ? ServiceId.create(model.serviceId) : null,
            rating: model.rating,
            comment: model.comment,
            createdAt: DateTime.from(model.createdAt),
            updatedAt: DateTime.from(model.updatedAt),
        });
    }
}