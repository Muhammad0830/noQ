import type { ShopCategory, Shop, Service } from "@noq/shared"

export type { ShopCategory, Shop };

export interface ShopWithServices extends Omit<Shop, "services"> {
    services: Service[];
}