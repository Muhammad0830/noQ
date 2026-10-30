import { Review } from "@/domain/review/entities/Review.js";

export function toReviewListResource(reviewList: Review[]) {
    return reviewList.map(review => ({
        id: review.getId().toString(),
        userId: review.getUserId().toString(),
        shopId: review.getShopId()?.toString(),
        serviceId: review.getServiceId()?.toString(),
        rating: review.getRating(),
        commment: review.getComment(),
        createdAt: review.getCreatedAt().getValue(),
        updatedAt: review.getUpdatedAt().getValue(),
    }))
}