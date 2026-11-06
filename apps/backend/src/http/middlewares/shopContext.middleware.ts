import { AuthorizeShopAccessUseCaseInterface } from "@/application/shop/interfaces/AuthorizeShopAccessUseCaseInterface.js";
import { NextFunction, Request, Response } from "express";

export function shopContextMiddleware(
    authorizeShopAccess: AuthorizeShopAccessUseCaseInterface
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const rawShopId = req.headers["x-shop-id"];

            const shopId = typeof rawShopId === "string"
                ? rawShopId.trim()
                : "";

            if (!shopId) {
                return res.status(400).json({
                    message: "Shop ID is required",
                });
            }

            if (!req.user) {
                res.status(401).json({
                    message: "Unauthenticated",
                });
                return;
            }

            const result = await authorizeShopAccess.execute({
                userId: req.user.id,
                shopId: shopId
            });

            req.shopContext = {
                shopId,
                role: result.position,
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}