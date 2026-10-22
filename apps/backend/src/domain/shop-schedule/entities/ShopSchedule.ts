import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { ShopScheduleId } from "../value-objects/ShopScheduleId.js";
import type { DayOfWeek } from "../value-objects/DayOfWeek.js";
import type { ShopScheduleType } from "../value-objects/ShopScheduleType.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

interface Props {
    id: ShopScheduleId,
    shopId: ShopId,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    type: ShopScheduleType,
    createdAt: DateTime,
    updatedAt: DateTime,
}

type CreateShopScheduleProps = Omit<Props, 'createdAt' | 'updatedAt'>;

export class ShopSchedule {
    constructor(
        private readonly props: Props,
    ) { }

    static create(props: CreateShopScheduleProps): ShopSchedule {
        if (!props.id.toString().trim()) {
            throw new Error("Schedule ID is required");
        }

        if (!props.shopId.toString().trim()) {
            throw new Error("Schedule ShopID is required");
        }

        if (!props.startTime.trim()) {
            throw new Error("Schedule start time is required");
        }

        if (!props.endTime.trim()) {
            throw new Error("Schedule end time is required");
        }

        return new ShopSchedule({
            ...props,
            createdAt: DateTime.now(),
            updatedAt: DateTime.now(),
        });
    }

    getId(): ShopScheduleId {
        return this.props.id;
    }

    getShopId(): ShopId {
        return this.props.shopId;
    }

    getDayOfWeek(): DayOfWeek {
        return this.props.dayOfWeek;
    }

    getStartTime(): string {
        return this.props.startTime;
    }

    getEndTime(): string {
        return this.props.endTime;
    }

    getType(): ShopScheduleType {
        return this.props.type;
    }

    getCreatedAt(): DateTime {
        return this.props.createdAt;
    }

    sameAsOther(other: ShopSchedule): boolean {
        return this.props.id.equals(other.getId());
    }

    private touch(): void {
        this.props.updatedAt = DateTime.now();
    }
}