import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodType } from "zod";

export function validateQuery(schema: ZodType): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.query);

        if (!result.success) {
            res.status(400).json({
                message: "Invalid query parameters",
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join("."),
                    message: issue.message,
                }))
            })
            return;
        }

        res.locals.validatedQuery = result.data;
        next();
    }
}

export function validateBody(schema: ZodType): RequestHandler {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: "Booking Create Validation Failed",
                errors: result.error.issues.map(issue => ({
                    field: issue.path.join('.'),
                    message: issue.message
                })),
                data: null
            })
        }

        req.body = result.data;
        next();
    }
}