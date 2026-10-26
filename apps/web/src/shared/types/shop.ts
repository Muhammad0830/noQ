import { Review } from "@/features/reviews/types";
import type { ShopCategory, Shop, Service, User } from "@noq/shared"

export type { ShopCategory, Shop };

export interface ShopWithServices extends Omit<Shop, "services"> {
    services: Service[];
}

export interface ShopWithStaffs extends Omit<Shop, "services"> {
    staffs: User[];
    services: Service[];
    reviews: Review[];
}