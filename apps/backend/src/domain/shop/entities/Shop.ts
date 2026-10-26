import type { ShopId } from "../value-objects/ShopId.js";
import type { OwnerId } from "@/domain/owner/value-objects/OwnerId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopCategory } from "@/domain/shop-category/entities/ShopCategory.js";

interface Props {
    id: ShopId,
    ownerId: OwnerId,
    name: string,
    isOpen: boolean,
    address: string,
    category: ShopCategory,
    createdAt: DateTime,
    updatedAt: DateTime,
    description?: string,
    logoUrl?: string,
    phone: string,
    backgroundImageUrl?: string,
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

        if (!props.category) {
            throw new Error("Category is required");
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

    getOwnerId(): OwnerId {
        return this.props.ownerId;
    }

    getCategory(): ShopCategory {
        return this.props.category;
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
        return this.props.phone;
    }

    getBackgroundImageUrl(): string | null {
        return this.props.backgroundImageUrl ?? null;
    }

    isOpen(): boolean {
        return this.props.isOpen;
    }
}