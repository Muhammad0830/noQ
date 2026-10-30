import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";

export interface CreateReviewUseCaseInput {
    userId: string;
    shopId?: string;
    serviceId?: string;
    rating: number;
    comment?: string;
}

export interface CreateReviewUseCaseInterface {
    execute(input: CreateReviewUseCaseInput): Promise<ReviewId>
}