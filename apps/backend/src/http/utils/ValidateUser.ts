import { Request } from "express";

export function validateUser(req: Request): NonNullable<Request["user"]> {
    if (!req.user) {
        throw new Error("Shop Context is missing");
    }

    return req.user;
}