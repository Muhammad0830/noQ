import { ShopBlockId } from "@/domain/shop-block/value-objects/ShopBlockId.js";

export interface CreateEmergencyBlockUseCaseInterface {
    execute(input: CreateEmergencyBlockInput): Promise<void>
}

export interface CreateEmergencyBlockInput {
    shopId: string;
    blockList: {
        startTime: string;
        endTime: string;
        reason: string;
    }[];
}