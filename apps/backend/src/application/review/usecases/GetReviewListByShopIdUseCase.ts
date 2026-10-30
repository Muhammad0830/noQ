import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { GetReviewListByShopIdUseCaseInterface, GetReviewListByShopIdUseCaseOutput } from
    "@/application/review/interfaces/GetReviewListByShopIdUseCaseInterface.js";
import { ReviewRepositoryInterface } from
    "@/domain/review/repositories/ReviewRepositoryInterface.js";

export class GetReviewListByShopIdUseCase implements GetReviewListByShopIdUseCaseInterface {
    constructor(
        private readonly reviewRepository: ReviewRepositoryInterface,
    ) { }

    async execute(shopId: string): Promise<GetReviewListByShopIdUseCaseOutput> {
        const shopIdValueObject = ShopId.create(shopId);

        const reviewList = await this.reviewRepository.getByShopId(shopIdValueObject);

        return { reviewList };
    }
}