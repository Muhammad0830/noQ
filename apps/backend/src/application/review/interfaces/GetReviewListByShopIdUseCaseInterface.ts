import { Review } from "@/domain/review/entities/Review.js"

export interface GetReviewListByShopIdUseCaseOutput {
    reviewList: Review[];
}

export interface GetReviewListByShopIdUseCaseInterface {
    execute(shopId: string): Promise<GetReviewListByShopIdUseCaseOutput>
}