import type { ShopBlock } from "../entities/ShopBlock.js";
import type { ShopBlockId } from "../value-objects/ShopBlockId.js";

export interface ShopBlockRepository {
    findById(shopBlockId: ShopBlockId): Promise<ShopBlock>;

    save(shopBlock: ShopBlock): Promise<void>;

    add(shopBlock: ShopBlock): Promise<void>;
}