import type { Staff, Shop } from "@/index.js";

export interface Service {
    id: string;
    name: string;
    description?: string;
    price?: number;
    durationMin?: number;
    isActive?: boolean;
    shopId?: string;
    shop?: Shop;
    bufferTime?: number | null;
    assignedToAllStaff?: boolean;
    assignedStaffId?: string | null;
    assignedStaff?: Staff | null;
}