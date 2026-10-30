import { Booking } from "@/domain/booking/entities/Booking.js";
import type { BookingRepositoryInterface, BookingWithService } from "@/domain/booking/repositories/BookingRepositoryInterface.js";
import { BookingId } from "@/domain/booking/value-objects/BookingId.js";
import { BookingStatus } from "@/domain/booking/value-objects/BookingStatus.js";
import { CustomerId } from "@/domain/customer/value-objects/CustomerId.js";
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
                serviceId: booking.getServiceId()?.toString(),
                startTime: booking.getStartTime().getValue(),
                endTime: booking.getEndTime().getValue(),
                status: booking.getStatus().getValue(),
                serviceName: booking.getServiceName(),
                servicePrice: booking.getServicePrice().amount,
            }
        })
    }

    async save(booking: Booking): Promise<void> {
        const cancelledAt = booking.getCancelledAt();

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
                ...(cancelledAt && { cancelledAt: cancelledAt.getValue() }),
            },
        })
    }

    async getByStartTimeForCustomers(
        customerId: CustomerId,
        statusList: BookingStatus[],
        futureOnly: boolean,
    ): Promise<Booking[]> {
        const statusValusList = statusList.map(status => status.getValue());

        const bookingList = await this.prisma.booking.findMany({
            where: {
                userId: customerId.toString(),
                status: { in: statusValusList },
                ...(futureOnly && { startTime: { gt: DateTime.now().getValue(), } })
            },
            include: { service: true },
        })

        return bookingList.map(booking => this.toEntity(booking));
    }

    nextIdentity(): BookingId {
        return BookingId.create();
    }

    private toEntity(bookingModel: BookingWithService) {
        return Booking.create({
            id: BookingId.create(bookingModel.id),
            shopId: ShopId.create(bookingModel.id),
            customerId: CustomerId.create(bookingModel.userId),
            startTime: DateTime.from(bookingModel.startTime),
            endTime: DateTime.from(bookingModel.endTime),
            status: BookingStatus.from(bookingModel.status),
            servicePrice: Money.fromAmount(Number(bookingModel.servicePrice), 'UZS'),
            serviceName: bookingModel.serviceName,
            cancellationReason: bookingModel.cancellationReason,
            serviceId: bookingModel.service
                ? ServiceId.create(bookingModel.service.id)
                : null,
            cancelledAt: bookingModel.cancelledAt
                ? DateTime.from(bookingModel.cancelledAt)
                : null,
        })
    }
}