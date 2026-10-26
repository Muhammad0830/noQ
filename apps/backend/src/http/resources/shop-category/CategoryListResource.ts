import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";
import { ShopCategory as ShopCategoryResponse } from "@noq/shared";

export function toCategoryListResource(
    categoryList: ShopCategory[]
): ShopCategoryResponse[] {
    return categoryList.map(category => ({
        id: category.getId().toString(),
        name: category.getName(),
        icon: category.getIcon(),
        createdAt: category.getCreatedAt().getValue(),
        updatedAt: category.getUpdatedAt().getValue(),
    }))
}