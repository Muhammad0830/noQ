import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategoryRepositoryInterface } from "@/domain/shop-category/repositories/ShopCategoryRepositoryInterface.js";
import { CreateShopCategoryUseCaseInput, CreateShopCategoryUseCaseInterface, CreateShopCategoryUseCaseOutput } from "../interfaces/CreateShopCategoryUseCaseInterface.js";

export class CreateShopCategoryUseCase implements CreateShopCategoryUseCaseInterface {
    constructor(
        private readonly categoryRepository: ShopCategoryRepositoryInterface,
    ) { }

    async execute(input: CreateShopCategoryUseCaseInput): Promise<CreateShopCategoryUseCaseOutput> {
        const shopCategoryId = this.categoryRepository.nextIdentity();

        const shopCategory = ShopCategory.create({
            id: shopCategoryId,
            name: input.name,
            icon: input.icon
        });

        await this.categoryRepository.add(shopCategory);
        return { id: shopCategory.getId(), name: shopCategory.getName() };
    }
}