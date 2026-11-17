import {
    BookingAvailabilityCheckerInput,
    FamousServiceItem,
    GetBookedSlotListByDateQueryInput,
    GetBookingDataQueryInterface,
    GetCountByTimeInput,
    GetFamousServiceListInput,
    GetListByDateTimeInput,
    GetListByDateTimeOutput,
    GetListByUserIdInput,
    GetListByUserIdOutput,
    GetPeakHourListInput,
    GetPriceByTimeInput,
    GetRevenueByTimeInput,
    GetRevenueByTimeOutput,
    GetShopHistoryBookingListInput,
    GetShopHistoryBookingListOutput,
    PeakHourItem
} from "@/application/booking/interfaces/GetBookingDataQueryInterface.js";
import { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { TimeSlot } from "@/domain/shared/value-objects/TimeSlot.js";
import { BookingStatus as BookingStatusEnum } from "@noq/shared";
import { Prisma, PrismaClient } from "@prisma/client";

export class GetBookingDataQuery implements GetBookingDataQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async getBookedSlotList(input: GetBookedSlotListByDateQueryInput): Promise<TimeSlot[]> {
        const bookings = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                startTime: {
                    gte: input.startTime.getValue(),
                    lte: input.endTime.getValue(),
                },
            },
            select: {
                startTime: true,
                endTime: true
            },
        });

        return bookings.map(booking => TimeSlot.create({
            start: DateTime.from(booking.startTime),
            end: DateTime.from(booking.endTime),
        }));
    }

    async getListByUserId(input: GetListByUserIdInput): Promise<GetListByUserIdOutput> {
        const now = new Date();

        const statusList = {
            ongoing: [
                BookingStatusEnum.PENDING,
                BookingStatusEnum.IN_PROGRESS,
                BookingStatusEnum.CONFIRMED,
            ],
            completed: [BookingStatusEnum.COMPLETED],
            cancelled: [BookingStatusEnum.CANCELLED],
        };

        const bookingList = await this.prisma.booking.findMany({
            where: {
                userId: input.customerId.toString(),
                status: {
                    in: statusList[input.view],
                },
                ...(input.view === "ongoing" && {
                    startTime: {
                        gt: now,
                    }
                })
            },
            include: {
                service: true,
                shop: true,
            },
        })

        return {
            bookings: bookingList.map(booking => ({
                id: booking.id,
                serviceId: booking.serviceId || null,
                shopId: booking.shopId,
                customerId: booking.userId,
                serviceName: booking.serviceName,
                servicePrice: Number(booking.servicePrice),
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: BookingStatus.from(booking.status),
                createdAt: booking.createdAt,
                shop: {
                    id: booking.shop.id,
                    name: booking.shop.name,
                    address: booking.shop.address,
                    backgroundImageUrl: booking.shop.backgroundImageUrl
                },
                service: booking.service ? {
                    id: booking.service.id,
                    name: booking.service.name,
                    price: Number(booking.service.price),
                    durationMin: booking.service.durationMin,
                } : null,
            }))
        }
    }

    async checkAvailability(input: BookingAvailabilityCheckerInput): Promise<boolean> {
        const conflictBooking = await this.prisma.booking.findFirst({
            where: {
                shopId: input.shopId.toString(),
                status: { notIn: ["CANCELLED", "NO_SHOW"] },
                startTime: { lt: input.endTime.getValue() },
                endTime: { gt: input.startTime.getValue() },
            },
        });

        const conflictBlock = await this.prisma.shopBlock.findFirst({
            where: {
                shopId: input.shopId.toString(),
                startTime: { lt: input.endTime.getValue() },
                endTime: { gt: input.startTime.getValue() },
            },
        });

        return Boolean(conflictBooking || conflictBlock);
    }

    async getCountByTime(input: GetCountByTimeInput): Promise<number> {
        return await this.prisma.booking.count({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lte: input.endTime.getValue(),
                },
            },
        });
    }

    async getPriceListByTime(input: GetPriceByTimeInput): Promise<number[]> {
        const services = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            select: {
                servicePrice: true
            },
        });

        return services.flatMap(s => Number(s.servicePrice))
    }

    async getRevenueByTime(input: GetRevenueByTimeInput): Promise<GetRevenueByTimeOutput> {
        const bookings = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            select: {
                startTime: true,
                servicePrice: true,
            },
            orderBy: {
                startTime: "asc",
            },
        });

        return {
            bookings: bookings.map(b => ({
                startTime: DateTime.from(b.startTime),
                servicePrice: Number(b.servicePrice),
            }))
        }
    }

    async getFamousServiceList(input: GetFamousServiceListInput): Promise<FamousServiceItem[]> {
        const services = await this.prisma.booking.groupBy({
            by: ["serviceId", "serviceName"],
            where: {
                shopId: input.shopId.toString(),
                status: "COMPLETED",
                serviceId: {
                    not: null,
                },
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            _count: {
                _all: true,
            },
            orderBy: {
                _count: {
                    serviceId: "desc",
                },
            },
            take: 5,
        });

        return services.filter(
            (service): service is typeof service & {
                serviceId: string;
            } => service.serviceId !== null
        ).map(service => ({
            id: service.serviceId,
            name: service.serviceName,
            bookingCount: service._count._all,
        }));
    }

    async getPeakHourList(input: GetPeakHourListInput): Promise<PeakHourItem[]> {
        return await this.prisma.$queryRaw<PeakHourItem[]>(Prisma.sql`
            SELECT
                EXTRACT(HOUR FROM "startTime")::int AS hour,
                COUNT(*)::int AS count
            FROM "Booking"
            WHERE
                "shopId" = ${input.shopId.toString()}
                AND "status" = 'COMPLETED'
                AND "startTime" >= ${input.startTime.getValue()}
                AND "startTime" <= ${input.endTime.getValue()}
            GROUP BY hour
            ORDER BY hour ASC
        `);
    }

    async getListByDateTime(input: GetListByDateTimeInput): Promise<GetListByDateTimeOutput> {
        const bookingList = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phoneNumber: true,
                        avatarUrl: true,
                    },
                },
                staff: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                startTime: "asc",
            }
        });

        return {
            bookingList: bookingList.map(booking => ({
                id: booking.id,
                startTime: booking.startTime,
                endTime: booking.endTime,
                serviceName: booking.serviceName,
                servicePrice: Number(booking.servicePrice),
                staff: booking.staff ? {
                    id: booking.staff.user.id,
                    name: booking.staff.user.name,
                } : null,
                status: BookingStatusEnum[booking.status],
                customer: {
                    id: booking.user.id,
                    name: booking.user.name,
                    email: booking.user.email,
                    phoneNumber: booking.user.phoneNumber,
                    avatarUrl: booking.user.avatarUrl,
                }
            }))
        }
    }

    async getShopHistoryBookingList(input: GetShopHistoryBookingListInput): Promise<GetShopHistoryBookingListOutput> {
        const bookingList = await this.prisma.booking.findMany({
            where: {
                shopId: input.shopId.toString(),
                startTime: {
                    gte: input.startTime.getValue(),
                    lt: input.endTime.getValue(),
                },
                ...(input.searchQuery && {
                    OR: [
                        {
                            user: {
                                name: {
                                    contains: input.searchQuery,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            service: {
                                name: {
                                    contains: input.searchQuery,
                                    mode: "insensitive",
                                },
                            },
                        },
                        {
                            staff: {
                                user: {
                                    name: {
                                        contains: input.searchQuery,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        },
                    ],
                }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                staff: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            }
        });

        return {
            bookingList: bookingList.map(booking => ({
                id: booking.id,
                userId: booking.userId,
                shopId: booking.shopId,
                serviceId: booking.serviceId,
                serviceName: booking.serviceName,
                servicePrice: Number(booking.servicePrice),
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: BookingStatusEnum[booking.status],
                staffId: booking.staffId,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
                user: {
                    id: booking.user.id,
                    name: booking.user.name
                },
                staff: booking.staff ? {
                    id: booking.staff.id,
                    name: booking.staff.user.name,
                } : null
            }))
        }
    }
}