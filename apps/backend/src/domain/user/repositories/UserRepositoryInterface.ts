import { User } from "../entities/User.js";
import { UserId } from "../value-objects/UserId.js";

export interface UserRepositoryInterface {
    findById(userId: UserId): Promise<User>;

    exists(userId: UserId): Promise<boolean>;

    add(user: User): Promise<void>;

    save(user: User): Promise<void>;
}