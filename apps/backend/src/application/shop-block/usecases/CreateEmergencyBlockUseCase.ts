import { CreateEmergencyBlockInput, CreateEmergencyBlockUseCaseInterface } from "../interfaces/CreateEmergencyBlockUseCaseInterface.js";
import { ShopBlockCreationUnitOfWorkInterface } from "../interfaces/ShopBlockCreationUnitOfWorkInterface.js";
import { ShopRepositoryInterface } from "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ShopBlock } from "@/domain/shop-block/entities/ShopBlock.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";

export class CreateEmergencyBlockUseCase implements CreateEmergencyBlockUseCaseInterface {
    constructor(
        private readonly shopBlockCreationUnitOfWork: ShopBlockCreationUnitOfWorkInterface,
        private readonly shopRepository: ShopRepositoryInterface,
    ) { }

    async execute(input: CreateEmergencyBlockInput): Promise<void> {
        await this.shopBlockCreationUnitOfWork.execute(async (tx) => {
            const shopId = ShopId.create(input.shopId);

            await this.shopRepository.ensureExists(shopId);

            const shopBlockList = input.blockList.map(block =>
                ShopBlock.create({
                    id: tx.shopBlockRepository.nextIdentity(),
                    shopId: shopId,
                    startTime: DateTime.from(block.startTime),
                    endTime: DateTime.from(block.endTime),
                    reason: block.reason,
                })
            );

            await tx.shopBlockRepository.addMany(shopBlockList);
        });
    }
}