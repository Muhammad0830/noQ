import { UserPosition } from "@/domain/shared/value-objects/UserPosition.ts";
import { AuthenticatedUser } from "@/types.ts";

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