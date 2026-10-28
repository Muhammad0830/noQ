import { Review } from "@/domain/review/entities/Review.js";
import { ReviewRepositoryInterface } from "@/domain/review/repositories/ReviewRepositoryInterface.js";
import { GetAllReviewsUseCaseInterface } from "../interfaces/GetAllReviewsUseCaseInterface.js";

export class GetAllReviewUseCase implements GetAllReviewsUseCaseInterface {
    constructor(
        private readonly reviewRepository: ReviewRepositoryInterface,
    ) { }

    async execute(): Promise<Review[]> {
        const reviewList = await this.reviewRepository.getAll();

        return reviewList;
    }
}