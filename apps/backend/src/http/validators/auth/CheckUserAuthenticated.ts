import { RequestWithUser } from "@/types.js";
import { AuthenticatedUser } from "@/types/auth.js";
import { Response } from "express";

export function checkUserAuthenticated(
    req: RequestWithUser,
    res: Response
): AuthenticatedUser | null {
    if (!req.user) {
        res.status(401).json({
            message: "Unauthorized",
        });

        return null;
    }

    return req.user;
}