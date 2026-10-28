export interface GetTrendingShopListUseCaseOutput {
    shopList: {
        id: string,
        ownerId: string,
        categoryId: string,
        name: string,
        description: string | null,
        timezone: string,
        isOpen: boolean,
        address: string,
        createdAt: Date,
        updatedAt: Date,
        phoneNumber: string,
        backgroundImageUrl: string | null,
        logoUrl: string | null,
        services: string[],
        servicesCount: number,
        reviewCount: number,
        averageRating: number,
        category: {
            id: string;
            name: string;
            icon: string | null;
            createdAt: Date;
            updatedAt: Date;
        },
    }[]
}

export interface GetTrendingShopListUseCaseInterface {
    execute(): Promise<GetTrendingShopListUseCaseOutput>
}
