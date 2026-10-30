import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";
import { FavouriteServiceId } from "../value-objects/FavouriteServiceId.js";

export interface Props {
    id: FavouriteServiceId,
    serviceId: ServiceId,
    userId: UserId,
    createdAt: DateTime,
    updatedAt: DateTime,
}

export interface CreateProps extends Omit<Props, 'createdAt' | 'updatedAt'> {
    createdAt?: DateTime,
    updatedAt?: DateTime,
}

export class FavouriteService {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateProps): FavouriteService {
        if (!props.id.toString().trim()) {
            throw new Error("Favourite Service ID is required");
        }

        if (!props.serviceId.toString().trim()) {
            throw new Error("Favourite Service ServiceId is required");
        }

        if (!props.userId.toString().trim()) {
            throw new Error("Favourite Service UserID is required");
        }

        return new FavouriteService({
            id: props.id,
            serviceId: props.serviceId,
            userId: props.userId,
            createdAt: props.createdAt ?? DateTime.now(),
            updatedAt: props.updatedAt ?? DateTime.now(),
        });
    }

    getId(): FavouriteServiceId {
        return this.props.id;
    }

    getUserId(): UserId {
        return this.props.userId;
    }

    getServiceId(): ServiceId {
        return this.props.serviceId;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    getUpdatedAt(): DateTime {
        return this.props.updatedAt;
    }

    sameAsOther(other: FavouriteService): boolean {
        return other.getId().equals(this.props.id);
    }
}