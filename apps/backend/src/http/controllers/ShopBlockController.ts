import { CreateEmergencyBlockUseCaseInterface } from "@/application/shop-block/interfaces/CreateEmergencyBlockUseCaseInterface.js";
import { GetEmergencyBlockListUseCaseInterface } from "@/application/shop-block/interfaces/GetEmergencyBlockListUseCaseInterface.js";
import { RequestWithShop } from "@/types.js";
import { RequestHandler } from "express";
import { CreateShopBlockSchema } from "../validators/shop-block/CreateShopBlockSchema.js";

export class ShopBlockController {
    constructor(
        private readonly getEmergencyBlockListUseCase: GetEmergencyBlockListUseCaseInterface,
        private readonly createEmergencyBlockUseCase: CreateEmergencyBlockUseCaseInterface,
    ) { }

    create: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const blockListData = req.body as CreateShopBlockSchema;

            await this.createEmergencyBlockUseCase.execute({
                shopId: shopId,
                blockList: blockListData.map(block => ({
                    startTime: block.startTime,
                    endTime: block.endTime,
                    reason: block.reason ?? "No reason",
                })),
            });

            res.status(201).json({
                success: true,
                message: "Emergency Block created successfully",
            })
        } catch (error) {
            next(error);
        }
    }

    list: RequestHandler = async (req, res, next) => {
        try {
            const shopId = (req as RequestWithShop).shop.id;

            const emergencyBlockList = await this.getEmergencyBlockListUseCase.execute(shopId);

            res.status(200).json(emergencyBlockList);
        } catch (error) {
            next(error);
        }
    }
}