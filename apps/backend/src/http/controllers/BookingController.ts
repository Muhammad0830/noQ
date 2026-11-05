import type { RequestHandler, Response } from "express";
import type { CreateBookingUseCaseInterface } from
    "@/application/booking/interfaces/CreateBookingUseCaseInterface.js";
import type { GetUserBookingListUseCaseInterface } from
    "@/application/booking/interfaces/GetBookingListUseCaseInterface.js";
import type { CancelBookingRequestBody, GetUserBookingsQuery } from
    "@/http/interfaces/booking.js";
import type { CancelBookingUseCaseInterface } from
    "@/application/booking/interfaces/CancelBookingUseCaseInterface.js";
import type { GetAvailableSlotsUseCaseInput, GetAvailableSlotsUseCaseInterface } from
    "@/application/booking/interfaces/GetAvailableSlotsUseCaseInterface.js";
import type { RequestWithShop, RequestWithUser } from "@/types.js";
import { toCreateBookingResource } from "@/http/resources/booking/CreateBookingResource.js";
import { toBookingResource, } from "@/http/resources/booking/UserBookingsResource.js";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";
import { CreateBookingRequestBody } from "../validators/booking/CreateBookingSchema.js";
import { UserRole } from "@/domain/shared/value-objects/UserRole.js";
import { CancelBookingSchema } from "../validators/booking/CancelBookingSchema.js";
import { CancelBookingByAdminUseCaseInterface } from "@/application/booking/interfaces/CancelBookingByAdminUseCase.js";
import { CompleteBookingUseCaseInterface } from "@/application/booking/interfaces/CompleteBookingUseCaseInterface.js";

export class BookingController {
    constructor(
        private readonly createBookingUseCase: CreateBookingUseCaseInterface,
        private readonly getUserBookingListUsecase: GetUserBookingListUseCaseInterface,
        private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCaseInterface,
        private readonly cancelBookingUseCase: CancelBookingUseCaseInterface,
        private readonly cancelBookingByAdminUseCase: CancelBookingByAdminUseCaseInterface,
        private readonly completeBookingUseCase: CompleteBookingUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const body = req.body as CreateBookingRequestBody;

            const result = await this.createBookingUseCase.execute({
                customerId: user.id,
                shopId: body.shopId,
                date: body.date,
                startTime: body.startTime,
                serviceId: body.serviceId,
                actorRole: UserRole.from(user.role)
            });

            res.status(201).json(
                toCreateBookingResource(result)
            );
        } catch (error) {
            next(error);
        }
    }

    listForUsers: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const query = res.locals.validatedQuery as GetUserBookingsQuery;

            const userBookingList = await this.getUserBookingListUsecase.execute({
                customerId: user.id,
                view: query.view,
            });

            res.status(200).json(
                toBookingResource(userBookingList)
            );
        } catch (error) {
            next(error);
        }
    }

    cancel: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            if (!checkUserAuthenticated(req as RequestWithUser, res as Response)) {
                return;
            }

            const input = req.body as CancelBookingRequestBody;

            await this.cancelBookingUseCase.execute(input)

            res.status(201).json({
                success: true,
                message: "Booking Cancelled successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    cancelByAdmin: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };
            const shopId = (req as RequestWithShop).shop.id;
            const { reason } = req.body as CancelBookingSchema;

            await this.cancelBookingByAdminUseCase.execute({
                id: id,
                shopId: shopId,
                reason: reason,
            })

            res.status(201).json({
                success: true,
                message: "Booking cancelled successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    availableSlots: RequestHandler = async (req, res, next) => {
        try {
            const query = res.locals.validatedQuery as GetAvailableSlotsUseCaseInput;

            const availableSlots = await this.getAvailableSlotsUseCase.execute(query);

            res.status(200).json(availableSlots)
        } catch (error) {
            next(error);
        }
    }

    complete: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };
            const shopId = (req as RequestWithShop).shop.id;

            await this.completeBookingUseCase.execute({
                id: id,
                shopId: shopId
            });
            
            res.status(201).json({
                success: true,
                message: "Booking completed successfully",
            })
        } catch (error) {
            next(error);
        }
    }
}