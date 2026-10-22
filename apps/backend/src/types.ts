import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { AuthenticatedUser } from "./types/auth.js";

export interface MulterFile {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
}

export interface RequestWithUser<TQuery = {}> extends Request<ParamsDictionary, any, any, TQuery> {
    user: AuthenticatedUser
}