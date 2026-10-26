import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategoryRepositoryInterface } from "@/domain/shop-category/repositories/ShopCategoryRepositoryInterface.js";

export class GetAllShopCategoryListUseCase {
    constructor(
        private readonly shopCategoryRepository: ShopCategoryRepositoryInterface,
    ) { }

    async execute(): Promise<ShopCategory[]> {
        const categoryList = await this.shopCategoryRepository.all();

        return categoryList;
    }
}