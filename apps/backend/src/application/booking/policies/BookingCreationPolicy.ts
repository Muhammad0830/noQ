import { UserRole } from "@/domain/shared/value-objects/UserRole.js";

export class BookingCreationPolicy {
    canCreatePastBooking(actorRole: UserRole): boolean {
        return actorRole.equals(UserRole.ADMIN);
    }
}