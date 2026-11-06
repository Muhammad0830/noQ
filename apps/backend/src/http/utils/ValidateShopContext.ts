import { Request } from "express";

export function validateShopContext(req: Request): NonNullable<Request["shopContext"]> {
    if (!req.shopContext) {
        throw new Error("Shop Context is missing");
    }

    return req.shopContext;
}