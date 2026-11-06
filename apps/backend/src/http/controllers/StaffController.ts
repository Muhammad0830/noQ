import { GetStaffListUseCaseInterface } from "@/application/staff/interfaces/GetStaffListUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { toStaffListResource } from "../resources/staff/GetStaffListResource.js";

export class StaffController {
    constructor(
        private readonly getStaffListUseCase: GetStaffListUseCaseInterface,
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
}