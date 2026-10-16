import type { Service } from "@/shared/types/service";
import type { Staff } from "@/shared/types/staff";
import type { ShopCategory, Shop } from "@noq/shared"

export type { ShopCategory, Shop };

export interface ShopWithServices extends Omit<Shop, "services"> {
    services: Service[];
}

export interface ShopWithStaffs extends Omit<Shop, "services"> {
    staffs: Staff[];
    services: Service[];
}