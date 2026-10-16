import { Service } from "@/shared/types/service";
import { Shop } from "@/shared/types/shop";
import { User } from "@/shared/types/user";

export interface Review {
    id: string;
    rating: number;
    comment?: string;
    userId: string;
    user?: User;
    shopId?: string;
    shop?: Shop;
    serviceId?: string;
    service?: Service;
    createdAt: string;
}
