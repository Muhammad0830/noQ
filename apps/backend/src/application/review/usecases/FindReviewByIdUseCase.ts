import {
    GetReviewDataQueryInterface,
    ReviewDetails
} from "../interfaces/GetReviewDataQueryInterface.js";
import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { FindReviewByIdUseCaseInterface } from
    "../interfaces/FindReviewByIdUseCaseInterface.js";

export class FindReviewByIdUseCase implements FindReviewByIdUseCaseInterface {
    constructor(
        private readonly getReviewDataQuery: GetReviewDataQueryInterface,
    ) { }

    async execute(id: string): Promise<ReviewDetails> {
        const reviewId = ReviewId.create(id);

        const review = await this.getReviewDataQuery.findById(reviewId);

        return review;
    }
}