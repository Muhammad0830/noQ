import type { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";

export interface BookingAvailabilityCheckerInput {
    shopId: ShopId,
    endTime: DateTime,
    startTime: DateTime,
}

export interface BookingAvailabilityCheckerQueryInterface {
    hasConflict(input: BookingAvailabilityCheckerInput): Promise<boolean>;
}