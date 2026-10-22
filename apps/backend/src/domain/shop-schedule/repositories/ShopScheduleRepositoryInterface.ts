import type { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { ShopSchedule } from "../entities/ShopSchedule.js";
import type { DayOfWeek } from "../value-objects/DayOfWeek.js";
import type { ShopScheduleId } from "../value-objects/ShopScheduleId.js";
import type { ShopScheduleType } from "../value-objects/ShopScheduleType.js";

export interface ShopScheduleRepositoryInterface {
    findById(scheduleId: ShopScheduleId): Promise<ShopSchedule>;

    getByShopId(
        shopId: ShopId,
        dayOfWeek?: DayOfWeek,
        type?: ShopScheduleType
    ): Promise<ShopSchedule[]>;
}