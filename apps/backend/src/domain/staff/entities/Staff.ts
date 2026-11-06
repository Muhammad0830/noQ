import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { StaffId } from "../value-objects/StaffId.js";
import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";

export interface Props {
    id: StaffId,
    userId: UserId,
    shopId: ShopId,
    position: UserPosition,
    createdAt: DateTime,
    updatedAt: DateTime,
}

export interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime;
    updatedAt?: DateTime;
}

export class Staff {
    constructor(
        private readonly props: Props
    ) { }

    static create(props: CreateProps): Staff {
        if (!props.id.toString().trim()) {
            throw new Error("Staff ID is required");
        }

        if (!props.shopId.toString().trim()) {
            throw new Error("Staff Shop ID is required");
        }

        if (!props.userId.toString().trim()) {
            throw new Error("Staff user ID is required");
        }

        return new Staff({
            id: props.id,
            userId: props.userId,
            shopId: props.shopId,
            position: props.position,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        })
    }

    getId(): StaffId {
        return this.props.id;
    }

    getUserId(): UserId {
        return this.props.userId;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getPosition(): UserPosition {
        return this.props.position;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    sameAsOther(other: Staff): boolean {
        return other.getId().equals(this.props.id);
    }
}