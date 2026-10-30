import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { MulterFile } from "@/types.js";

export interface SlotItem {
    block: boolean;
    startTime: string;
    endTime: string;
}

export interface ScheduleItem {
    dayOfWeek: number;
    slots: SlotItem[];
}

export interface ServiceItem {
    name: string;
    price: number;
    durationMin: number;
    selectedStaffs: string[];
    bufferTime: number | null;
    description: string | null;
}

export interface ShopDetails {
    userId: string;
    categoryId: string;
    name: string;
    address: string;
    phoneNumber: string;
    description: string | null;
    logoUrl: string | null;
    file: MulterFile | null;
}

export interface CreateShopUseCaseInput {
    shop: ShopDetails,
    schedule: ScheduleItem[],
    services: ServiceItem[];
}

export interface CreateShopUseCaseInterface {
    execute(input: CreateShopUseCaseInput): Promise<ShopId>
}