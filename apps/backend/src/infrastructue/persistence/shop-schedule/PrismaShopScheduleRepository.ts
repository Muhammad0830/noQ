import { ShopSchedule } from "@/domain/shop-schedule/entities/ShopSchedule.js";
import type { ShopScheduleRepositoryInterface } from "@/domain/shop-schedule/repositories/ShopScheduleRepositoryInterface.js";
import { DayOfWeek } from "@/domain/shop-schedule/value-objects/DayOfWeek.js";
import { ShopScheduleId } from "@/domain/shop-schedule/value-objects/ShopScheduleId.js";
import { ShopScheduleType } from "@/domain/shop-schedule/value-objects/ShopScheduleType.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { Prisma, PrismaClient, ShopSchedule as ShopScheduleModel } from "@prisma/client";

type PrismaExecutor = PrismaClient | Prisma.TransactionClient;

export class PrismaShopScheduleRepository implements ShopScheduleRepositoryInterface {
    constructor(
        private readonly prisma: PrismaExecutor,
    ) { }

    async findById(scheduleId: ShopScheduleId): Promise<ShopSchedule> {
        const schedule = await this.prisma.shopSchedule.findUnique({
            where: {
                id: scheduleId.toString(),
            },
        });

        if (!schedule) {
            throw new Error("Schedule not found");
        }

        return this.toEntity(schedule);
    }

    async getByShopId(
        shopId: ShopId,
        dayOfWeek?: DayOfWeek,
        type: ShopScheduleType | undefined = undefined
    ): Promise<ShopSchedule[]> {
        const scheduleList = await this.prisma.shopSchedule.findMany({
            where: {
                shopId: shopId.toString(),

                ...(dayOfWeek && {
                    dayOfWeek: dayOfWeek.getValue()
                }),

                ...(type && {
                    type: type.getValue(),
                }),
            }
        })

        return scheduleList.map(schedule => this.toEntity(schedule));
    }

    async addMany(scheduleList: ShopSchedule[]): Promise<void> {
        await this.prisma.shopSchedule.createMany({
            data: scheduleList.map(schedule => ({
                id: schedule.getId().toString(),
                shopId: schedule.getShopId().toString(),
                dayOfWeek: schedule.getDayOfWeek().getValue(),
                startTime: schedule.getStartTime(),
                endTime: schedule.getEndTime(),
                type: schedule.getType().getValue(),
                createdAt: schedule.getCreatedAt().getValue(),
                updatedAt: schedule.getUpdatedAt().getValue(),
            }))
        })
    }

    nextIdentity(): ShopScheduleId {
        return ShopScheduleId.create();
    }

    private toEntity(model: ShopScheduleModel): ShopSchedule {
        return ShopSchedule.create({
            id: ShopScheduleId.create(model.id),
            shopId: ShopId.create(model.shopId),
            dayOfWeek: DayOfWeek.from(model.dayOfWeek),
            type: ShopScheduleType.from(model.type),
            startTime: model.startTime,
            endTime: model.endTime,
        })
    }
}