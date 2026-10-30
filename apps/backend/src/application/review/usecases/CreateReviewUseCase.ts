import { ReviewRepositoryInterface } from "@/domain/review/repositories/ReviewRepositoryInterface.js";
import { CreateReviewUseCaseInput, CreateReviewUseCaseInterface } from "../interfaces/CreateReviewUseCaseInterface.js";
import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { Review } from "@/domain/review/entities/Review.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";

export class CreateReviewUseCase implements CreateReviewUseCaseInterface {
    constructor(
        private readonly reviewRepository: ReviewRepositoryInterface,
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) { }

    async execute(input: CreateReviewUseCaseInput): Promise<ReviewId> {
        if (!input.shopId?.trim() && !input.serviceId?.trim()) {
            throw new Error("At least shop ID or service ID is required");
        }

        const reviewId = this.reviewRepository.nextIdentity();
        const userId = UserId.create(input.userId);
        const shopId = ShopId.create(input.shopId);
        const shopExists = shopId ? await this.shopRepository.exists(shopId) : false;

        if (shopId && !shopExists) {
            throw new Error("Shop not found");
        }

        const serviceId = input.serviceId ? ServiceId.create(input.serviceId) : null;
        const service = serviceId ? await this.serviceRepository.findById(serviceId) : null;

        if (serviceId && !service) {
            throw new Error("Service not found");
        }

        if (shopId && service && !service.getShopId().equals(shopId)) {
            throw new Error("Selected Service does not belong to selected Shop")
        }

        const review = Review.create({
            id: reviewId,
            userId: userId,
            serviceId: serviceId,
            shopId: service?.getShopId() ?? shopId,
            rating: input.rating,
            comment: input.comment ?? null,
        });

        await this.reviewRepository.add(review);
        return reviewId;
    }
}