import type { ShopCategoryId } from "../value-objects/ShopCategoryId.js";

interface Props {
    id: ShopCategoryId,
    name: string,
    icon?: string,
    createdAt: Date,
    updatedAt: Date,
}

interface CreateProps {
    id: ShopCategoryId,
    name: string,
    icon?: string,
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

        const now = new Date();

        return new ShopCategory({
            ...props,
            createdAt: now,
            updatedAt: now,
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

    hasIcon(): boolean {
        return !!this.props.icon;
    }
}