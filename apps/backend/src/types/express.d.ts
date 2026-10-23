import type { AuthenticatedUser } from "./auth.ts"

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
        }
    }
}