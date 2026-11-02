import { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";

export interface ShopScheduleUpdateUnitOfWorkInterface {
    execute<T>(
        callback: (transaction: ShopScheduleUpdateTransaction) => Promise<T>
    ): Promise<T>;
}

export interface ShopScheduleUpdateTransaction {
    shopScheduleRepository: ShopScheduleRepositoryInterface;
}

export interface ShopScheduleDTO {
    scheduleList: {
        dayOfWeek: number;
        isOpen: boolean;
        blocks: {
            startTime: string;
            endTime: string;
        }[];
        openTime?: {
            startTime: string;
            endTime: string;
        };
    }[];
}

export const defaultShopScheduleDTO: ShopScheduleDTO = {
    scheduleList: [
        {
            dayOfWeek: 0,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 1,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 2,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 3,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 4,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 5,
            isOpen: false,
            blocks: [],
        },
        {
            dayOfWeek: 6,
            isOpen: false,
            blocks: [],
        },
    ]
}