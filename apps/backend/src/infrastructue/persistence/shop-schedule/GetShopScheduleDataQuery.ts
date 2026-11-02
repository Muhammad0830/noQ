import { GetShopScheduleDataQueryInterface } from "@/application/shop-schedule/interfaces/GetShopScheduleDataQueryInterface.js";
import { defaultShopScheduleDTO, ShopScheduleDTO } from "@/application/shop-schedule/interfaces/ShopScheduleUpdateUnitOfWorkInterface.js";
import { ShopScheduleType } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import { PrismaClient } from "@prisma/client";

export class GetShopScheduleDataQuery implements GetShopScheduleDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getWeekly(shopId: ShopId): Promise<ShopScheduleDTO> {
        const shopScheduleList = await this.prisma.shopSchedule.findMany({
            where: { shopId: shopId.toString() },
            orderBy: [
                { dayOfWeek: "asc" },
                { startTime: "asc" },
            ],
        });

        const dto: ShopScheduleDTO = defaultShopScheduleDTO;

        shopScheduleList.forEach(schedule => {
            if (schedule.type === ShopScheduleType.OPEN.getValue()) {
                dto.scheduleList[schedule.dayOfWeek].isOpen = true;
                dto.scheduleList[schedule.dayOfWeek].openTime = {
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                }
            } else if (schedule.type === ShopScheduleType.BLOCK.getValue()) {
                dto.scheduleList[schedule.dayOfWeek].blocks.push({
                    startTime: schedule.startTime,
                    endTime: schedule.endTime,
                });
            }
        });

        return dto;
    }
}