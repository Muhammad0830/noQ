export interface RemoveFromFavouriteServiceUseCaseInterface {
    execute(input: RemoveFromFavouriteServiceUseCaseInput): Promise<void>;
}

export interface RemoveFromFavouriteServiceUseCaseInput {
    serviceId: string,
    userId: string,
}