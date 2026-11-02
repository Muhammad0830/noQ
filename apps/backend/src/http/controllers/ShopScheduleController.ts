import { UpdateShopScheduleUseCaseInterface } from "@/application/schedule/interfaces/UpdateShopScheduleUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { UpdateShopScheduleSchema } from "../validators/shop-schedule/UpdateShopScheduleSchema.js";

export class ShopScheduleController {
    constructor(
        private readonly updateShopScheduleUseCase: UpdateShopScheduleUseCaseInterface,
    ) { }

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
}