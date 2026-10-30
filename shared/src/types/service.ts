import type { Staff, Shop } from "@/index.js";

export interface Service {
    id: string;
    shopId: string;
    name: string;
    description?: string;
    price?: number;
    durationMin?: number;
    isActive?: boolean;
    shop?: Shop;
    bufferTime?: number | null;
    assignedToAllStaff?: boolean;
    assignedStaffId?: string | null;
    assignedStaff?: Staff | null;
}

export type ServiceInBookingData = Pick<Service,
    'id' |
    'name' |
    'price' |
    'durationMin'
>
