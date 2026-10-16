import type { User } from "@/types/user.js"
import type { Shop } from "@/types/shop.js";
import type { Service } from "@/types/service.js";

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  IN_PROGRESS = 'IN_PROGRESS',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Booking {
  id: string;
  userId: string;
  shopId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  user?: User;
  shop?: Shop;
  service?: Service;
}