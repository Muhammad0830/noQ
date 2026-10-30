import { UserId } from "@/domain/user/value-objects/UserId.js";
import { Review } from "@/domain/review/entities/Review.js";
import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";

export interface ReviewRepositoryInterface {
    findById(reviewId: ReviewId): Promise<Review>;

    getAll(): Promise<Review[]>;

    getByReviewId(reviewIdList: ReviewId[]): Promise<Review[]>;

    getByUserId(userId: UserId): Promise<Review[]>;

    getByShopId(shopId: ShopId): Promise<Review[]>;

    getByServiceId(serviceId: ServiceId): Promise<Review[]>;

    add(review: Review): Promise<void>;

    save(review: Review): Promise<void>;

    nextIdentity(): ReviewId;
}