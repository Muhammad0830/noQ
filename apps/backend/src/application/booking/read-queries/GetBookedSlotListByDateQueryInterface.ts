import type { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface GetBookedSlotListByDateQueryInput {
    shopId: ShopId,
    startTime: DateTime,
    endTime: DateTime,
}

export interface GetBookedSlotListByDateQueryInterface {
    execute(input: GetBookedSlotListByDateQueryInput): Promise<TimeSlot[]>;
}