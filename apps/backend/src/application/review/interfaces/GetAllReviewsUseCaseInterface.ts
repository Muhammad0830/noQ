import { Review } from "@/domain/review/entities/Review.js";

export interface GetAllReviewsUseCaseInterface {
    execute(): Promise<Review[]>;
}