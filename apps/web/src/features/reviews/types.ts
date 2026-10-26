import { Shop } from "@/shared/types/shop";
import { User } from "@/shared/types/user";
import { Service } from "@noq/shared";

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
