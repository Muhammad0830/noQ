import {
    UpdateShopScheduleUseCaseInput,
    UpdateShopScheduleUseCaseInterface
} from "../interfaces/UpdateShopScheduleUseCaseInterface.js";
import { ShopScheduleRepositoryInterface } from
    "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";
import { ShopScheduleUpdateUnitOfWorkInterface } from
    "../interfaces/ShopScheduleUpdateUnitOfWorkInterface.js";
import { ShopRepositoryInterface } from
    "@/domain/shop/repositories/ShopRepositoryInterface.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { ShopSchedule } from "@/domain/shop-schedule/entities/ShopSchedule.js";
import { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import { ShopScheduleType } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";

export class UpdateShopScheduleUseCase implements UpdateShopScheduleUseCaseInterface {
    constructor(
        private readonly shopScheduleRepository: ShopScheduleRepositoryInterface,
        private readonly shopRepository: ShopRepositoryInterface,
        private readonly unitOfWork: ShopScheduleUpdateUnitOfWorkInterface,
    ) { }

    async execute(input: UpdateShopScheduleUseCaseInput): Promise<void> {
        try {
            await this.unitOfWork.execute(async (tx) => {
                const shopId = ShopId.create(input.shopId);

                await this.shopRepository.ensureExists(shopId);

                const shopScheduleList = input.scheduleList.map(schedule =>
                    ShopSchedule.create({
                        id: this.shopScheduleRepository.nextIdentity(),
                        shopId: shopId,
                        dayOfWeek: DayOfWeek.from(schedule.dayOfWeek),
                        startTime: schedule.startTime,
                        endTime: schedule.endTime,
                        type: ShopScheduleType.from(schedule.type),
                    })
                );

                await tx.shopScheduleRepository.replaceForShop(
                    shopId,
                    shopScheduleList,
                );
            });
        } catch (error) {
            throw error;
        }
    }
}