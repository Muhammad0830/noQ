import { ShopScheduleTypeValue } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";

export interface ScheduleList {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    type: ShopScheduleTypeValue;
}

export interface UpdateShopScheduleUseCaseInterface {
    execute(input: UpdateShopScheduleUseCaseInput): Promise<void>;
}

export interface UpdateShopScheduleUseCaseInput {
    shopId: string;
    scheduleList: ScheduleList[];
}