import type { Shop } from "@/types/shop.js";

export interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string | null;
    role: "USER" | "ADMIN";
    createdAt: string;
    avatarUrl?: string | null;
    shops?: Shop[];
}