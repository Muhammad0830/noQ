import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ReviewId } from "../value-objects/ReviewId.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export interface Props {
    id: ReviewId;
    userId: UserId;
    shopId: ShopId;
    serviceId: ServiceId | null;
    rating: number;
    comment: string | null;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime;
    updatedAt?: DateTime;
}

export class Review {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateProps): Review {
        if (!props.id.toString().trim()) {
            throw new Error("Review ID is required");
        }

        if (!props.userId.toString().trim()) {
            throw new Error("Review UserID is required");
        }

        if (!props.shopId?.toString().trim && !props.serviceId?.toString().trim()) {
            throw new Error("At least shopID or serviceID is required");
        }

        if (props.rating > 5 || props.rating < 0) {
            throw new Error("Invalid rating value, rating must be between 0 and 5");
        }

        return new Review({
            id: props.id,
            userId: props.userId,
            shopId: props.shopId,
            serviceId: props.serviceId,
            rating: props.rating,
            comment: props.comment,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): ReviewId {
        return this.props.id;
    }

    getUserId(): UserId {
        return this.props.userId;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getServiceId(): ServiceId | null {
        return this.props.serviceId;
    }

    getRating(): number {
        return this.props.rating;
    }

    getComment(): string | null {
        return this.props.comment;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    sameAsOther(other: Review): boolean {
        return other.getId().equals(this.props.id);
    }

    updateRating(rating: number): void {
        this.props.rating = rating;
        this.touch();
    }

    updateComment(comment: string): void {
        this.props.comment = comment;
        this.touch();
    }

    private touch(): void {
        this.props.updatedAt = DateTime.now()
    }
}