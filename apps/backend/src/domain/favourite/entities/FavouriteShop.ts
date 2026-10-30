import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { FavouriteShopId } from "../value-objects/FavouriteShopId.js";

export interface Props {
    id: FavouriteShopId,
    shopId: ShopId,
    userId: UserId,
    createdAt: DateTime,
    updatedAt: DateTime,
}

export interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime,
    updatedAt?: DateTime,
}

export class FavouriteShop {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateProps): FavouriteShop {
        if (!props.id.toString().trim()) {
            throw new Error("Favourite Shop ID is required");
        }

        if (!props.shopId.toString().trim()) {
            throw new Error("Favourite Shop ShopID is required");
        }

        if (!props.userId.toString().trim()) {
            throw new Error("Favourite Shop UserID is required");
        }

        return new FavouriteShop({
            id: props.id,
            shopId: props.shopId,
            userId: props.userId,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): FavouriteShopId {
        return this.props.id;
    }

    getUserId(): UserId {
        return this.props.userId;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    sameAsOther(other: FavouriteShop): boolean {
        return other.getId().equals(this.props.id);
    }
}