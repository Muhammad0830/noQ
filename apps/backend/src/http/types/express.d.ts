import { UserPosition } from "@/domain/shared/value-objects/UserPosition.ts";
import { AuthenticatedUser } from "@/types/auth.ts";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;

            shopContext?: {
                shopId: string;
                role: UserPosition;
            };
        }
    }
}

export {};