import { Booking } from "@/domain/booking/entities/Booking.js";
import type { BookingRepositoryInterface, BookingWithService } from "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
import { Service } from "@/domain/service/entities/Service.js";
import { ServiceId } from "@/domain/service/value-objects/ServiceId.js";
import { DateTime } from "@/domain/shared/value-objects/DateTime.js";
import { Money } from "@/domain/shared/value-objects/Money.js";
import { ShopId } from "@/domain/shop/value-objects/ShopId.js";
import type { PrismaClient } from "@prisma/client";

export class PrismaBookingRepository implements BookingRepositoryInterface {
    public constructor(
        private readonly prisma: PrismaClient,
    ) { }

    async findById(id: BookingId): Promise<Booking> {
        const bookingModel = await this.prisma.booking.findUnique({
            where: { id: id.toString() },
            include: {
                service: true
            }
        });

        if (!bookingModel) {
            throw new Error("Booking not found");
        }

        return this.toEntity(bookingModel);
    }

    async add(booking: Booking): Promise<void> {
        await this.prisma.booking.create({
            data: {
                id: booking.getId().toString(),
                userId: booking.getCustomerId().toString(),
                shopId: booking.getShopId().toString(),
                serviceId: booking.getServiceId().toString(),
                startTime: booking.getStartTime().getValue(),
                endTime: booking.getEndTime().getValue(),
                status: booking.getStatus().getValue(),
            }
        })
    }

    async save(booking: Booking): Promise<void> {
        await this.prisma.booking.update({
            where: {
                id: booking.getId().toString(),
            },
            data: {
                status: booking.getStatus().getValue(),
                startTime: booking.getStartTime().getValue(),
                endTime: booking.getEndTime().getValue(),
                updatedAt: booking.getUpdatedAt().getValue(),
                cancellationReason: booking.getCancellationReason(),
                cancelledAt: booking.getCancelledAt(),
            },
        })
    }

    async getByStartTimeForCustomers(
        customerId: CustomerId,
        statusList: BookingStatus[],
        futureOnly: boolean,
    ): Promise<Booking[]> {
        const now = new Date();

        const statusValusList = statusList.map(status => status.getValue());

        const bookingList = await this.prisma.booking.findMany({
            where: {
                userId: customerId.toString(),
                status: {
                    in: statusValusList,
                },
                ...(futureOnly && {
                    startTime: {
                        gt: now,
                    }
                })
            },
            include: {
                service: true,
            },
        })

        return bookingList.map(booking => this.toEntity(booking));
    }

    nextIdentity(): BookingId {
        return BookingId.create();
    }

    private toEntity(bookingModel: BookingWithService) {
        const shopId = ShopId.create(bookingModel.id);

        const service = Service.create({
            id: ServiceId.create(bookingModel.service.id),
            shopId: shopId,
            name: bookingModel.service.name,
            description: bookingModel.service.description,
            durationMin: bookingModel.service.durationMin,
            bufferTime: bookingModel.service.bufferTime,
            isActive: bookingModel.service.isActive,
            price: Money.fromAmount(Number(bookingModel.service.price), "UZS"),
            createdAt: DateTime.from(bookingModel.service.createdAt),
            updatedAt: DateTime.from(bookingModel.service.updatedAt),
        });

        return Booking.create({
            id: BookingId.create(bookingModel.id),
            serviceId: service.getId(),
            shopId: shopId,
            customerId: CustomerId.create(bookingModel.userId),
            startTime: DateTime.from(bookingModel.startTime),
            service: service,
            ...(bookingModel.status && {
                status: BookingStatus.from(bookingModel.status) // if there is no status then uses default status
            }),
        })
    }
}