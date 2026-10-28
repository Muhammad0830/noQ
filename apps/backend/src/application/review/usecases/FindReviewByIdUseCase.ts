import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";
import { FindReviewByIdUseCaseInterface } from "../interfaces/FindReviewByIdUseCaseInterface.js";
import { GetReviewDataQueryInterface, ReviewDetails } from "../interfaces/GetReviewDataQueryInterface.js";

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