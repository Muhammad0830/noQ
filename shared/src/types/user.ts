import type { Shop } from "@/types/shop.js";

export interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string | null;
    role: UserRoleType;
    position?: UserPositionType;
    createdAt: string;
    avatarUrl?: string | null;
    shops?: Shop[];
}

export type UserRoleType = "USER" | "ADMIN";

export type UserPositionType = "STAFF" | "OWNER" | "MANAGER";

export interface SignUpResponse { 
    user: {
        id: string;
        name: string;
        email: string;
        phoneNumber: string | null;
    };
    access_token: string,
    refresh_token: string,
}