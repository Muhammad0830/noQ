import { ReviewId } from "@/domain/review/value-objects/ReviewId.js";

export interface ReviewDetails {
    id: string;
    userId: string;
    shopId: string | null;
    serviceId: string | null;
    rating: number;
    comment: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        avatarUrl: string | null;
    };
    service: {
        id: string;
        shopId: string;
        name: string;
        price: number;
        durationMin: number;
        isActive: boolean;
        description: string | null;
        bufferTime: number | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
    shop: {
        id: string;
        name: string;
        address: string;
        timezone: string;
        phoneNumber: string;
        categoryId: string;
        ownerId: string;
        isOpen: boolean;
        description: string | null;
        logoUrl: string | null;
        backgroundImageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        category: {
            id: string;
            name: string;
            icon: string | null;
        }
    } | null;
}

export interface GetReviewDataQueryInterface {
    findById(id: ReviewId): Promise<ReviewDetails>
}