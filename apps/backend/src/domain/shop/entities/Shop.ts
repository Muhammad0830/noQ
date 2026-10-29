import type { ShopId } from "../value-objects/ShopId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

interface Props {
    id: ShopId,
    ownerId: UserId,
    categoryId: ShopCategoryId,
    name: string,
    isOpen: boolean,
    address: string,
    createdAt: DateTime,
    updatedAt: DateTime,
    description: string | null,
    logoUrl: string | null,
    phoneNumber: string,
    backgroundImageUrl: string | null,
}

interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime,
    updatedAt?: DateTime,
}

export class Shop {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateProps): Shop {
        if (!props.id.toString().trim()) {
            throw new Error("Shop ID is required");
        }

        if (!props.ownerId.toString().trim()) {
            throw new Error("Owner ID is required");
        }

        if (!props.categoryId.toString().trim()) {
            throw new Error("Category ID is required");
        }

        if (!props.name.trim()) {
            throw new Error("Shop name is required");
        }

        return new Shop({
            ...props,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
        });
    }

    sameShopAs(shop: Shop): boolean {
        return this.props.id === shop.getId();
    }

    getId(): ShopId {
        return this.props.id;
    }

    getOwnerId(): UserId {
        return this.props.ownerId;
    }

    getCategoryId(): ShopCategoryId {
        return this.props.categoryId;
    }

    getName(): string {
        return this.props.name;
    }

    getAddress(): string {
        return this.props.address;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    getDescription(): string | null {
        return this.props.description ?? null;
    }

    getLogoUrl(): string | null {
        return this.props.logoUrl ?? null;
    }

    getPhoneNumber(): string {
        return this.props.phoneNumber;
    }

    getBackgroundImageUrl(): string | null {
        return this.props.backgroundImageUrl ?? null;
    }

    isOpen(): boolean {
        return this.props.isOpen;
    }
}