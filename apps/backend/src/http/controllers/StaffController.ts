import { GetStaffListUseCaseInterface } from "@/application/staff/interfaces/GetStaffListUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { toStaffListResource } from "../resources/staff/GetStaffListResource.js";
import { CreateStaffUseCaseInterface } from "@/application/staff/interfaces/CreateStaffUseCaseInterface.js";
import { CreateStaffSchema } from "../validators/staff/CreateStaffSchema.js";

export class StaffController {
    constructor(
        private readonly getStaffListUseCase: GetStaffListUseCaseInterface,
        private readonly createStaffUseCase: CreateStaffUseCaseInterface,
    ) { }

    getList: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const staffList = await this.getStaffListUseCase.execute(shopId);

            res.status(200).json(toStaffListResource(staffList));
        } catch (error) {
            next(error);
        }
    }

    create: RequestHandler = async (req, res, next) => {
        try {
            const shopIdMiddleware = (req as RequestWithShop).shop.id;

            const { userId, shopId, position } = req.body as CreateStaffSchema;

            if (shopIdMiddleware !== shopId) {
                throw new Error("Shop ID mismatch");
            }

            await this.createStaffUseCase.execute({
                userId,
                shopId,
                position
            });

            res.status(201).json({
                success: true,
                message: "Staff created successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}