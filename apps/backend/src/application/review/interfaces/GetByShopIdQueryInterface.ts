import { Review } from "@/domain/review/entities/Review.js";

export interface GetReviewListQuery {
    getByShopId(): Promise<Review[]>
}