import type { Service, Shop, User } from "./index.js";

export interface Review {
    id: string;
    userId: string;
    rating: number;
    createdAt: string;
    serviceId?: string;
    shopId?: string;
    comment?: string | null;
    user?: User;
    shop?: Shop;
    service?: Service;
}
