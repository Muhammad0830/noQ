export interface RemoveFromFavouriteShopUseCaseInterface {
    execute(input: RemoveFromFavouriteShopUseCaseInput): Promise<void>;
}

export interface RemoveFromFavouriteShopUseCaseInput {
    shopId: string,
    userId: string,
}