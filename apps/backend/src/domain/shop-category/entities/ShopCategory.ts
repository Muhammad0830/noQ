import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { ShopCategoryId } from "../value-objects/ShopCategoryId.js";

interface Props {
    id: ShopCategoryId,
    name: string,
    icon?: string | null,
    createdAt: DateTime,
    updatedAt: DateTime,
}

interface CreateProps {
    id: ShopCategoryId,
    name: string,
    icon?: string | null,
    createdAt?: DateTime,
    updatedAt?: DateTime,
}

export class ShopCategory {
    constructor(
        private readonly props: Props
    ) { }

    static create(props: CreateProps): ShopCategory {
        if (!props.id.toString().trim()) {
            throw new Error("Category ID is required");
        }

        if (!props.name.trim()) {
            throw new Error("Category name is required");
        }

        return new ShopCategory({
            id: props.id,
            name: props.name,
            icon: props.icon,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): ShopCategoryId {
        return this.props.id;
    }

    getName(): string {
        return this.props.name;
    }

    getIcon(): string | null {
        return this.props.icon ?? null;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt
    }

    sameAsOther(other: ShopCategory): boolean {
        return this.props.name === other.getName() &&
            this.getIcon() === other.getIcon();
    }
}