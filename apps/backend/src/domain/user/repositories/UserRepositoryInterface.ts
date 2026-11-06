import { EmailAddress } from "@/domain/shared/value-objects/EmailAddress.js";
import { User } from "../entities/User.js";
import { UserId } from "../value-objects/UserId.js";

export interface UserRepositoryInterface {
    findById(userId: UserId): Promise<User>;

    findByEmail(emailAddress: EmailAddress): Promise<User>;

    exists(userId: UserId): Promise<boolean>;

    checkEmailExists(email: EmailAddress): Promise<boolean>;

    add(user: User): Promise<void>;

    save(user: User): Promise<void>;
}