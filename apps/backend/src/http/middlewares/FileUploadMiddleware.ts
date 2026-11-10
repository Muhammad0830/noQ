import { NextFunction, Request, RequestHandler, Response } from "express";

export const fileUploadMiddleware = ({
    type,
    size
}: {
    type?: string;
    size?: number;
}): RequestHandler => {
    return (req, res, next) => {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: "File is required",
            });
        }

        if (type && !allowedMimeTypes[type]?.includes(file.mimetype)) {
            return res.status(400).json({
                success: false,
                message: `Only ${type} files are allowed`,
                data: null,
            });
        }

        if (size && file.size > size) {
            res.status(400).json({
                success: false,
                message: "File size must not exceed expected size",
                data: null,
            });
            return;
        }

        next();
    }
}

const allowedMimeTypes: Record<string, string[]> = {
    image: [
        "image/jpeg",
        "image/png",
        "image/webp",
    ],
    pdf: [
        "application/pdf",
    ],
    csv: [
        "text/csv",
        "application/csv",
        "application/vnd.ms-excel",
    ],
};