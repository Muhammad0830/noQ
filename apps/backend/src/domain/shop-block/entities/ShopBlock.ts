import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { ShopBlockId } from "../value-objects/ShopBlockId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

interface Props {
    id: ShopBlockId,
    shopId: ShopId,
    startTime: DateTime,
    endTime: DateTime,
    reason?: string,
    createdAt: DateTime,
    updatedAt: DateTime,
}

type CreateShopBlockProps = Omit<Props, 'createdAt' | 'updatedAt'>

export class ShopBlock {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateShopBlockProps): ShopBlock {
        if (!props.id.toString().trim()) {
            throw new Error("ShopBlock ID is required");
        }

        if (!props.shopId.toString().trim()) {
            throw new Error("ShopBlock ShopID is required");
        }

        if (props.endTime.getTime() <= props.startTime.getTime()) {
            throw new Error("End Time should be after Start Time");
        }

        return new ShopBlock({
            id: props.id,
            shopId: props.shopId,
            startTime: props.startTime,
            endTime: props.endTime,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
            ...(props.reason && {
                reason: props.reason,
            }),
        });
    }

    getId(): ShopBlockId {
        return this.props.id;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getStartTime(): DateTime {
        return this.props.startTime;
    }

    getEndTime(): DateTime {
        return this.props.endTime;
    }

    getReason(): string {
        return this.props.reason ?? "No Reason";
    }

    sameAsOther(other: ShopBlock): boolean {
        return this.props.id.equals(other.getId());
    }

    private touch(): void {
        this.props.updatedAt = DateTime.now();
    }
}