import type { ShopCategoryId } from "@/domain/shop-category/value-objects/ShopCategoryId.js";
import type { ShopId } from "../value-objects/ShopId.js";
import type { OwnerId } from "@/domain/owner/value-objects/OwnerId.js";

interface Props {
    id: ShopId,
    ownerId: OwnerId,
    name: string,
    categoryId: ShopCategoryId,
    isOpen: boolean,
    createdAt: Date,
    updatedAt: Date,
    description?: string,
    logoUrl?: string,
    address?: string,
    phone?: string,
    backgroundImageUrl?: string,
}

type CreateProps = Omit<Props, 'createdAt' | 'updatedAt'>;

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

        const now = new Date();

        return new Shop({
            ...props,
            createdAt: now,
            updatedAt: now,
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

    getCategoryId(): ShopCategoryId {
        return this.props.categoryId;
    }

    getName(): string {
        return this.props.name;
    }

    getDescription(): string | null {
        return this.props.description ?? null;
    }

    getLogoUrl(): string | null {
        return this.props.logoUrl ?? null;
    }

    getAddress(): string | null {
        return this.props.address ?? null;
    }

    getPhoneNumber(): string | null {
        return this.props.phone ?? null;
    }

    getBackgroundImageUrl(): string | null {
        return this.props.backgroundImageUrl ?? null;
    }

    isOpen(): boolean {
        return this.props.isOpen;
    }
}