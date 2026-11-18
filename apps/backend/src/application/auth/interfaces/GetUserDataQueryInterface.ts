import { UserId } from "@/domain/user/value-objects/UserId.js";
import { UserRoleType } from "@noq/shared";

export interface GetUserDataQueryInterface {
    findUserById(id: UserId): Promise<UserItem>;
    getByEmail(search: string): Promise<GetByEmailOutput>
}

export interface UserItem {
    id: string;
    name: string;
    email: string;
    role: UserRoleType;
    avatarUrl: string | null;
    phoneNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
    shops: {
        id: string;
        name: string;
        category: {
            id: string;
            name: string;
            icon: string | null;
        }
    }[]
}
export interface GetByEmailOutput {
    userList: GetByEmailUserItem[]
}

export interface GetByEmailUserItem {
    id: string;
    name: string;
    email: string;
}