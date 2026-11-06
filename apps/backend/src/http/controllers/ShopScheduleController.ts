import { UpdateShopScheduleUseCaseInterface } from "@/application/shop-schedule/interfaces/UpdateShopScheduleUseCaseInterface.js";
import { RequestHandler } from "express";
import { UpdateShopScheduleSchema } from "../validators/shop-schedule/UpdateShopScheduleSchema.js";
import { GetShopScheduleDataUseCaseInterface } from "@/application/shop-schedule/interfaces/GetShopScheduleDataUseCaseInterface.js";
import { validateShopContext } from "../utils/ValidateShopContext.js";

export class ShopScheduleController {
    constructor(
        private readonly updateShopScheduleUseCase: UpdateShopScheduleUseCaseInterface,
        private readonly getShopScheduleDataUseCase: GetShopScheduleDataUseCaseInterface,
    ) { }

    update: RequestHandler = async (req, res, next) => {
        try {
            const body = req.body as UpdateShopScheduleSchema;
            const shopContext = validateShopContext(req);

            await this.updateShopScheduleUseCase.execute({
                shopId: shopContext.shopId,
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
            const shopContext = validateShopContext(req)

            const shopScheduleData = await this.getShopScheduleDataUseCase.execute(shopContext.shopId);

            res.status(200).json(shopScheduleData);
        } catch (error) {
            next(error);
        }
    }
}