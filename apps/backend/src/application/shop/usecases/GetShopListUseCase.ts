import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { GetShopListUseCaseInput, GetShopListUseCaseInterface, GetShopListUseCaseOutput } from "../interfaces/GetShopListUseCaseInterface.js";
import { ServiceRepositoryInterface } from "@/domain/service/repositories/ServiceRepositoryInterface.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";

const LIMIT = 10;

export class GetShopListUseCase implements GetShopListUseCaseInterface {
    constructor(
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly serviceRepository: ServiceRepositoryInterface,
    ) { }

    async execute(input: GetShopListUseCaseInput): Promise<GetShopListUseCaseOutput> {
        const hasPriceFilter = input.minPrice !== undefined && input.maxPrice !== undefined;
        const hasCategoryFilter = input.categoryIdList && input.categoryIdList.length > 0;
        const limit = input.limit ?? LIMIT;
        const categoryList = input.categoryIdList?.map(id => ShopCategoryId.create(id));

        if (
            input.search && (hasCategoryFilter || hasPriceFilter)
        ) {
            throw new Error("Cannot combine search with filters");
        }

        if (input.search) {
            const shops = await this.shopRepository.findMany({
                search: input.search,
                limit: limit,
            })

            const services = await this.serviceRepository.findMany({
                searchByShopName: input.search,
                limit: limit,
            })

            return { shops, services };
        }

        const shops = await this.shopRepository.findMany({
            limit: limit,
            categoryIdList: categoryList,
        });

        const services = await this.serviceRepository.findMany({
            limit: limit,
            categoryIdList: categoryList,
            minPrice: input.minPrice,
            maxPrice: input.maxPrice,
        });

        return { shops, services };
    }
}