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
import type { RequestWithUser } from "@/types.js";
import type { AuthenticatedUser } from "@/types/auth.js";
import { toCreateBookingResource } from "@/http/resources/booking/CreateBookingResource.js";
import { toBookingResource, } from "@/http/resources/booking/UserBookingsResource.js";
import { checkUserAuthenticated } from "../validators/auth/CheckUserAuthenticated.js";

export class BookingController {
    constructor(
        private readonly createBookingUseCase: CreateBookingUseCaseInterface,
        private readonly getUserBookingListUsecase: GetUserBookingListUseCaseInterface,
        private readonly cancelBookingUseCase: CancelBookingUseCaseInterface,
        private readonly getAvailableSlotsUseCase: GetAvailableSlotsUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = checkUserAuthenticated(req as RequestWithUser, res as Response);

            if (!user) {
                return;
            }

            const body = req.body;
            const customerId = user.id;
            const result = await this.createBookingUseCase.execute({ ...body, customerId });

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
                data: null,
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
}