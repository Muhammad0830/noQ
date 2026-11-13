import type { User } from "@/types/user.js"
import type { Shop, ShopInBookingData } from "@/types/shop.js";
import type { Service, ServiceInBookingData } from "@/types/service.js";

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
  serviceId: string | null;
  serviceName: string;
  servicePrice: number;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  createdAt: Date;
  user?: User;
  shop?: Shop;
  service?: Service;
}

export interface BookingItem extends Omit<Booking, 'service' | 'shop' | 'user'> {
  service: ServiceInBookingData | null,
  shop: ShopInBookingData,
}

export interface CancelBookingRequestBody {
  id: string;
  userId: string;
  reason?: string;
}

export interface DashboardBookingsResponse {
  data: DashboardBookingItem[];
}

export interface DashboardBookingItem {
  id: string;
  startTime: string;
  endTime: string;
  serviceName: string,
  servicePrice: number,
  staff: DashboardBookingStaff | null,
  status: BookingStatus,
  customer: DashboardBookingCustomer;
}

export interface DashboardBookingStaff {
  id: string;
  name: string;
}

export interface DashboardBookingCustomer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  avatarUrl: string | null;
}