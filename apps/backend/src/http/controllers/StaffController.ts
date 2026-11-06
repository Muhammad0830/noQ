import { GetStaffListUseCaseInterface } from "@/application/staff/interfaces/GetStaffListUseCaseInterface.js";
import { RequestHandler } from "express";
import { toStaffListResource } from "../resources/staff/GetStaffListResource.js";
import { CreateStaffUseCaseInterface } from "@/application/staff/interfaces/CreateStaffUseCaseInterface.js";
import { CreateStaffSchema } from "../validators/staff/CreateStaffSchema.js";
import { DeleteStaffUseCaseInterface } from "@/application/staff/interfaces/DeleteStaffUseCaseInterface.js";
import { validateShopContext } from "../utils/ValidateShopContext.js";

export class StaffController {
    constructor(
        private readonly getStaffListUseCase: GetStaffListUseCaseInterface,
        private readonly createStaffUseCase: CreateStaffUseCaseInterface,
        private readonly deleteStaffUseCase: DeleteStaffUseCaseInterface,
    ) { }

    getList: RequestHandler = async (req, res, next) => {
        try {
            const shopContext = validateShopContext(req)

            const staffList = await this.getStaffListUseCase.execute(shopContext.shopId);

            res.status(200).json(toStaffListResource(staffList));
        } catch (error) {
            next(error);
        }
    }

    create: RequestHandler = async (req, res, next) => {
        try {
            const shopContext = validateShopContext(req)

            const { userId, shopId, position } = req.body as CreateStaffSchema;

            if (shopContext.shopId !== shopId) {
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

    delete: RequestHandler = async (req, res, next) => {
        try {
            const { id } = req.params as { id: string };

            await this.deleteStaffUseCase.execute(id);

            res.status(201).json({
                success: true,
                message: "Staff deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}