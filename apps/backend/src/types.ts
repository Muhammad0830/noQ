import type { User } from "@noq/shared";

export interface MulterFile {
    originalname: string;
    buffer: Buffer;
    mimetype: string;
    size: number;
}

export interface AuthenticatedUser extends User { }