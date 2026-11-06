import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserRoleType } from "@noq/shared";

export interface GetStaffDataQueryInterface {
    getCountByShopId(shopId: ShopId): Promise<number>;
    getListByShopId(shopId: ShopId): Promise<StaffItem[]>;
}

export interface StaffItem {
    id: string;
    shopId: string;
    userId: string;
    position: UserPosition,
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        role: UserRoleType;
        phoneNumber: string | null;
    };
}