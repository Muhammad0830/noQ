import type { BookingListView, UserBookingListDTO } from "@/application/booking/dtos/UserBookingListDTO.js";
import type { UserBookingListQueryInterface } from "@/application/booking/read-queries/UserBookingListQueryInterface.js";
import { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import type { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { BookingStatus as BookingStatusEnum } from "@noq/shared";
import type { PrismaClient } from "@prisma/client";

export class PrismaUserBookingListQuery implements UserBookingListQueryInterface {
    constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async execute(input: {
        customerId: CustomerId,
        view: BookingListView,
    }): Promise<UserBookingListDTO> {
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
                serviceId: booking.serviceId,
                shopId: booking.shopId,
                customerId: booking.userId,
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
                service: {
                    id: booking.service.id,
                    name: booking.service.name,
                    price: Number(booking.service.price),
                    durationMin: booking.service.durationMin,
                },
            }))
        }
    }
}