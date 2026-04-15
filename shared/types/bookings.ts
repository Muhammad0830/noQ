import type { User, Shop, Service } from "./general_types";

export type StatusProps =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface Booking {
  id: string;
  userId: string;
  shopId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: StatusProps;
  createdAt: string;
  user?: User;
  shop?: Shop;
  service?: Service;
}
