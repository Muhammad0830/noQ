import { UserPosition } from "@/domain/shared/value-objects/UserPosition.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { UserId } from "@/domain/user/value-objects/UserId.js";

export interface ShopAccessQueryInterface {
    findUserRole(userId: UserId, shopId: ShopId): Promise<UserPosition | null>;
}