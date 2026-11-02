import { UpdateShopScheduleUseCaseInterface } from "@/application/shop-schedule/interfaces/UpdateShopScheduleUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { UpdateShopScheduleSchema } from "../validators/shop-schedule/UpdateShopScheduleSchema.js";
import { GetShopScheduleDataUseCaseInterface } from "@/application/shop-schedule/interfaces/GetShopScheduleDataUseCaseInterface.js";
import { GetEmergencyBlockListUseCaseInterface } from "@/application/shop-block/interfaces/GetEmergencyBlockListUseCaseInterface.js";

export class ShopScheduleController {
    constructor(
        private readonly updateShopScheduleUseCase: UpdateShopScheduleUseCaseInterface,
        private readonly getShopScheduleDataUseCase: GetShopScheduleDataUseCaseInterface,
        private readonly getEmergencyBlockListUseCase: GetEmergencyBlockListUseCaseInterface,
    ) { }

    addEmergencyBlock: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body;
        } catch (error) {
            next(error);
        }
    }

    update: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as UpdateShopScheduleSchema;
            const shopId = (req as RequestWithShop).shop.id;

            await this.updateShopScheduleUseCase.execute({
                shopId: shopId,
                scheduleList: body,
            });

            res.status(200).json({
                success: true,
                message: "Shop schedule updated successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    getWeekly: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const shopScheduleData = await this.getShopScheduleDataUseCase.execute(shopId);

            res.status(200).json(shopScheduleData);
        } catch (error) {
            next(error);
        }
    }
}